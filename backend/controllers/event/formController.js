const { defaultFields } = require('../../db/fields');
const cloudinary = require('../../config/cloud');
const Event = require('../../models/event/form');
const Field = require('../../models/event/field');

exports.createForm = async (req, res) => {
  const { name, desc, date, location, categories, price, organizer, postedBy } =
    req.body;

  const { file } = req;
  const newEvent = new Event({
    name,
    desc,
    date,
    location,
    categories,
    price,
    postedBy,
    organizer,
    fields: defaultFields,
  });

  if (file) {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file.path
    );
    newEvent.thumbnail = { url, public_id };
  }

  await newEvent.save();

  res.json({ event: newEvent });
};

exports.addFields = async (req, res) => {
  const { id } = req.params;
  const { fields } = req.body;

  const event = await Event.findById(id);
  if (!event) sendError(res, 400, 'Event not found!');

  const fieldIds = await Promise.all(
    fields.map(async (field) => {
      const newField = new Field(field);
      await newField.save();
      return newField._id;
    })
  );

  event.fields.push(...fieldIds);

  await event.save();

  res.json({ fields });
};
