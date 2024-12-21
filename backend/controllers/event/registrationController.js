const { sendError } = require('../../helpers/error');
const Event = require('../../models/event');
const Registration = require('../../models/event/registration');

exports.joinEvent = async (req, res) => {
  const { id } = req.params;
  const { response } = req.body;

  const event = await Event.findById(id).populate('fields');
  if (!event) return sendError(res, 404, 'Event not found');

  const eventFields = event.fields.map((field) => ({
    id: field._id.toString(),
    label: field.label,
    required: field.required,
    type: field.type,
    options: field.options || [],
  }));

  for (const field of eventFields) {
    const fieldResponse = response[field.id];

    if (
      field.required &&
      (fieldResponse === undefined || fieldResponse === '')
    ) {
      return sendError(res, 400, `${field.label} is required.`);
    }
  }

  // Save the valid registration
  const registration = new Registration({
    event: event._id,
    participant: req.user._id,
    response,
  });

  await registration.save();

  res.json({ registration });
};
