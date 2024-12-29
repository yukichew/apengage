const { sendError } = require('../../helpers/error');
const Event = require('../../models/event');
const Form = require('../../models/event/form');

exports.createForm = async (req, res) => {
  const { eventId, fields, deadline } = req.body;
  const createdBy = req.user._id;

  const event = await Event.findById(eventId);
  if (!event) return sendError(res, 404, 'Event not found!');

  const existingForm = await Form.findOne({ event: eventId });
  if (existingForm) {
    return sendError(
      res,
      400,
      'A form has already been created for this event.'
    );
  }
  const newForm = new Form({
    event: eventId,
    fields,
    createdBy,
    deadline,
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
