const cloudinary = require('../../config/cloud');
const { sendError } = require('../../helpers/error');
const Form = require('../../models/event/form');
const Registration = require('../../models/event/registration');
const QRCode = require('qrcode');

exports.joinEvent = async (req, res) => {
  const { id } = req.params;
  let { response } = req.body;
  const { file } = req;
  response = JSON.parse(response);

  const form = await Form.findById(id).populate('fields');
  if (!form) return sendError(res, 404, 'Event not found');

  const existingRegistration = await Registration.findOne({
    eventForm: form._id,
    participant: req.user._id,
  });

  // Check if user has already registered for the event
  if (existingRegistration) {
    return sendError(res, 400, 'You have already registered for this event.');
  }

  // Check if registration deadline has passed
  if (new Date() > form.deadline) {
    return sendError(res, 400, 'Registration deadline has passed.');
  }

  // Check if event has reached maximum capacity
  if (form.capacity && form.capacity > 0) {
    const currentRegistrations = await Registration.countDocuments({
      eventForm: form._id,
    });

    if (currentRegistrations >= form.capacity) {
      return sendError(
        res,
        400,
        `Registrations are full. Maximum capacity of ${form.capacity} reached.`
      );
    }
  }

  const formFields = form.fields.map((field) => ({
    id: field._id.toString(),
    label: field.label,
    required: field.required,
    type: field.type,
    options: field.options || [],
  }));

  for (const field of formFields) {
    const fieldResponse = response[field.id];

    // Check if all required fields are filled
    if (
      field.type !== 'file' &&
      field.required &&
      (fieldResponse === undefined || fieldResponse === '')
    ) {
      return sendError(res, 400, `${field.label} is required.`);
    }

    if (field.type === 'file') {
      if (field.required && !file) {
        return sendError(res, 400, `${field.label} file is required.`);
      }

      // upload file to cloudinary
      const { secure_url: url } = await cloudinary.uploader.upload(file.path, {
        folder: 'event_responses',
      });

      response[field.id] = url;
    }
  }

  const registration = new Registration({
    eventForm: form._id,
    participant: req.user._id,
    response,
  });

  await registration.save();

  // Generate QR code
  const qrCodeData = {
    registrationId: registration._id,
    eventForm: form._id,
    participantId: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };

  try {
    const qrCode = await QRCode.toDataURL(JSON.stringify(qrCodeData));
    registration.qrCode = qrCode;
    await registration.save();

    res.json({
      registration: {
        id: registration._id,
        eventForm: registration.eventForm,
        participant: registration.participant,
        response: registration.response,
        qrCode: registration.qrCode,
        status: registration.status,
      },
    });
  } catch (err) {
    return sendError(res, 500, 'Failed to generate QR code');
  }
};

exports.markAttendance = async (req, res) => {
  const { qrCodeData } = req.body;
  const { registrationId } = JSON.parse(qrCodeData);

  const registration = await Registration.findById(registrationId);
  if (!registration) return sendError(res, 404, 'Registration not found');

  if (registration.status === 'Attended') {
    return sendError(res, 400, 'Attendance already marked');
  }

  const eventForm = await Form.findById(registration.eventForm);
  if (!eventForm) return sendError(res, 404, 'Event form not found');

  const event = await Event.findById(eventForm.event);
  if (!event) return sendError(res, 404, 'Event not found');

  const currentTime = new Date();
  const twoHourBeforeStart = new Date(event.startTime);
  twoHourBeforeStart.setHours(twoHourBeforeStart.getHours() - 1);

  const oneHourAfterEnd = new Date(event.endTime);
  oneHourAfterEnd.setHours(oneHourAfterEnd.getHours() + 1);

  if (currentTime < twoHourBeforeStart || currentTime > oneHourAfterEnd) {
    return sendError(
      res,
      400,
      'Attendance can only be marked within =2 hours before and 1 hour after the event'
    );
  }

  registration.status = 'Attended';
  await registration.save();

  res.json({ message: 'Attendance marked successfully', registration });
};

exports.getRegistration = async (req, res) => {
  const { id } = req.params;
  const registration = await Registration.findById(id)
    .populate('eventForm', 'event')
    .populate('participant', 'fullname apkey');
  if (!registration) return sendError(res, 404, 'Registration not found');

  res.json({
    registration: {
      id: registration._id,
      eventId: registration.eventForm.event,
      participant: {
        fullname: registration.participant.fullname,
        apkey: registration.participant.apkey,
      },
      response: registration.response,
      qrCode: registration.qrCode,
      status: registration.status,
    },
  });
};

exports.getRegistrations = async (req, res) => {
  const { id } = req.params;

  const eventForm = await Form.findOne({ event: id });
  if (!eventForm) {
    return res.json({
      registrations: [],
      totalParticipants: 0,
      attended: 0,
      notAttended: 0,
      attendanceRate: 0,
      genderDistribution: [],
    });
  }

  const registrations = await Registration.find({
    eventForm: eventForm._id,
  }).sort({ createdAt: -1 });

  const totalRegistrations = await Registration.countDocuments({
    eventForm: eventForm._id,
  });

  const attendedRegistrations = await Registration.countDocuments({
    eventForm: eventForm._id,
    status: 'Attended',
  });

  const notAttendedRegistrations = await Registration.countDocuments({
    eventForm: eventForm._id,
    status: 'Absent',
  });

  const genderDistribution = await Registration.aggregate([
    { $match: { eventForm: eventForm._id } },
    {
      $lookup: {
        from: 'users',
        localField: 'participant',
        foreignField: '_id',
        as: 'participantDetails',
      },
    },
    { $unwind: '$participantDetails' },
    {
      $group: {
        _id: '$participantDetails.gender',
        count: { $sum: 1 },
      },
    },
  ]);

  const attendanceRate =
    totalRegistrations === 0
      ? 0
      : Math.round((attendedRegistrations / totalRegistrations) * 100);

  res.json({
    registrations: registrations.map((registration) => {
      return {
        id: registration._id,
        participant: registration.participant,
        response: registration.response,
        status: registration.status,
        createdAt: registration.createdAt,
        updatedAt: registration.updatedAt,
      };
    }),
    eventForm: eventForm._id,
    totalParticipants: totalRegistrations,
    attended: attendedRegistrations,
    notAttended: notAttendedRegistrations,
    attendanceRate: attendanceRate,
    genderDistribution: genderDistribution.map((gender) => ({
      gender: gender._id,
      count: gender.count,
    })),
  });
};

exports.searchParticipatedEvents = async (req, res) => {
  const userId = req.user._id;
  const { name } = req.query;

  const matchCriteria = { participant: userId };
  if (name) {
    matchCriteria['eventForm.event.name'] = { $regex: name, $options: 'i' };
  }

  const registrations = await Registration.find(matchCriteria).populate({
    path: 'eventForm',
    populate: {
      path: 'event',
      populate: {
        path: 'venueBooking',
        populate: {
          path: 'venue',
          select: 'name',
        },
      },
      select:
        'name type desc startTime endTime mode organizer categories location venueBooking price thumbnail',
    },
  });

  const events = registrations.map((registration) => ({
    registrationId: registration._id,
    event: {
      id: registration.eventForm.event._id,
      name: registration.eventForm.event.name,
      type: registration.eventForm.event.type,
      categories: registration.eventForm.event.categories,
      desc: registration.eventForm.event.desc,
      startTime: registration.eventForm.event.startTime,
      endTime: registration.eventForm.event.endTime,
      mode: registration.eventForm.event.mode,
      organizer: registration.eventForm.event.organizer,
      location: registration.eventForm.event.location,
      venue: registration.eventForm.event.venueBooking?.venue.name,
      price: registration.eventForm.event.price,
      thumbnail: registration.eventForm.event.thumbnail,
    },
    status: registration.status,
    qrCode: registration.qrCode,
    response: registration.response,
  }));

  res.json({ events, count: events.length });
};
