const { sendError } = require('../../helpers/error');
const Event = require('../../models/event');
const Form = require('../../models/event/form');
const Venue = require('../../models/logistic/venue');

exports.createForm = async (req, res) => {
  const { eventId, fields, deadline, capacity } = req.body;
  const createdBy = req.user._id;

  const event = await Event.findById(eventId).populate('venueBooking');
  if (!event) return sendError(res, 404, 'Event not found!');

  const existingForm = await Form.findOne({ event: eventId });
  if (existingForm) {
    return sendError(
      res,
      400,
      'A form has already been created for this event.'
    );
  }

  if (event.mode === 'oncampus' && event.venueBooking) {
    const venue = await Venue.findById(event.venueBooking.venue);
    if (!venue) {
      return sendError(res, 404, 'Venue not found!');
    }

    if (capacity <= 0) {
      return sendError(res, 400, 'Event capacity cannot be less than 1.');
    }

    if (capacity > venue.capacity) {
      return sendError(
        res,
        400,
        `Event capacity cannot exceed the venue's capacity of ${venue.capacity}.`
      );
    }
  }

  const newForm = new Form({
    event: eventId,
    fields,
    createdBy,
    deadline,
    capacity,
  });
  await newForm.save();

  res.json({ form: newForm });
};

exports.getForm = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const form = await Form.findOne({ event: id }).populate('fields');
  if (!form) return sendError(res, 404, 'Form not found');

  const getUserField = (normalizedLabel) => {
    return user[normalizedLabel] !== undefined ? normalizedLabel : null;
  };

  const preFilledFields = form.fields.map((field) => {
    const userKey = getUserField(field.normalizedLabel);
    if (field.defaultField && userKey) {
      return {
        id: field._id,
        ...field._doc,
        value: user[userKey] || '',
      };
    }
    return {
      id: field._id,
      ...field._doc,
    };
  });

  res.json({
    form: {
      id: form._id,
      event: form.event,
      fields: preFilledFields,
      createdBy: form.createdBy,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
      deadline: form.deadline,
    },
  });
};
