const { defaultFields } = require('../../db/fields');
const { sendError } = require('../../helpers/error');
const event = require('../../models/event');
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

  const allFields = [
    ...defaultFields.map((field) => ({
      ...field,
      normalizedLabel:
        field.normalizeLabel || field.label.toLowerCase().replace(/\s+/g, '_'),
    })),
    ...fields.map((field) => ({
      ...field,
      normalizedLabel:
        field.normalizedLabel || field.label.toLowerCase().replace(/\s+/g, '_'),
    })),
  ];

  const newForm = new Form({ event: eventId, fields: allFields, createdBy });
  await newForm.save();

  res.json({ form: newForm });
};

exports.getForm = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const form = await Form.findOne({ event: id }).populate('fields');
  if (!form) return sendError(res, 404, 'Form not found');

  const fieldMapping = defaultFields.reduce((acc, field) => {
    if (field.normalizeLabel) {
      acc[field.label.toLowerCase()] = field.normalizeLabel;
    }
    return acc;
  }, {});

  const preFilledFields = form.fields.map((field) => {
    const userKey = fieldMapping[field.label.toLowerCase()];
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
    },
  });
};
