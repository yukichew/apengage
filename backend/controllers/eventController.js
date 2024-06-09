const { defaultFields } = require('../db/fields');
const cloudinary = require('../config/cloud');
const Event = require('../models/event/form');

exports.createForm = async (req, res) => {
  const { name, desc, date, location, tags, price, organizer, fields } =
    req.body;

  const { file } = req;

  const allFields = [...defaultFields, ...fields];

  const newEvent = new Event({
    name,
    desc,
    date,
    location,
    tags,
    price,
    organizer,
    fields: allFields,
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
