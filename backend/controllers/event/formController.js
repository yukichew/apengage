const { defaultFields } = require('../../db/fields');
const cloudinary = require('../../config/cloud');
const Event = require('../../models/event/form');
const Field = require('../../models/event/field');

exports.createForm = async (req, res) => {
  const { name, desc, date, location, categories, price, organizer, fields } =
    req.body;

  const { file } = req;

  const allFields = [...defaultFields, ...fields];

  const fieldIds = await Promise.all(
    allFields.map(async (field) => {
      const newField = new Field(field);
      await newField.save();
      return newField._id;
    })
  );

  const newEvent = new Event({
    name,
    desc,
    date,
    location,
    categories,
    price,
    organizer,
    fields: fieldIds,
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
