const { sendError } = require('../../helpers/error');
const Form = require('../../models/event/form');
const Registration = require('../../models/event/registration');
const QRCode = require('qrcode');
const path = require('path');

exports.joinEvent = async (req, res) => {
  const { id } = req.params;
  const { response } = req.body;

  const form = await Form.findById(id).populate('fields');
  if (!form) return sendError(res, 404, 'Event not found');

  const existingRegistration = await Registration.findOne({
    eventForm: form._id,
    participant: req.user._id,
  });

  if (existingRegistration) {
    return sendError(res, 400, 'You have already registered for this event.');
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

    if (
      field.required &&
      (fieldResponse === undefined || fieldResponse === '')
    ) {
      return sendError(res, 400, `${field.label} is required.`);
    }
  }

  const registration = new Registration({
    eventForm: form._id,
    participant: req.user._id,
    response,
  });

  await registration.save();

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

  registration.status = 'Attended';
  await registration.save();

  res.json({ message: 'Attendance marked', registration });
};

exports.getRegistration = async (req, res) => {
  const { id } = req.params;
  const registration = await Registration.findById(id)
    .populate('eventForm', 'event')
    .populate('participant', 'fullname');
  if (!registration) return sendError(res, 404, 'Registration not found');

  res.json({
    registration: {
      id: registration._id,
      eventId: registration.eventForm.event,
      participant: registration.participant.fullname,
      response: registration.response,
      qrCode: registration.qrCode,
      status: registration.status,
    },
  });
};
