const { sendError } = require('../../helpers/error');
const Event = require('../../models/event');
const Form = require('../../models/event/form');

// exports.addFields = async (req, res) => {
//   const { id } = req.params;
//   const { fields } = req.body;

//   const event = await Event.findById(id);
//   if (!event) sendError(res, 400, 'Event not found!');

//   const fieldIds = await Promise.all(
//     fields.map(async (field) => {
//       const newField = new Field(field);
//       await newField.save();
//       return newField._id;
//     })
//   );

//   event.fields.push(...fieldIds);

//   await event.save();

//   res.json({ fields });
// };

exports.createForm = async (req, res) => {
  const { eventId, fields } = req.body;
  const createdBy = req.user._id;

  const event = await Event.findById(eventId);
  if (!event) return sendError(res, 404, 'Event not found!');

  const newForm = new Form({ event: eventId, fields, createdBy });
  await newForm.save();

  res.json({ form: newForm });
};
