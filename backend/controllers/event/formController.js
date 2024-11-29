const { defaultFields } = require('../../db/fields');
const cloudinary = require('../../config/cloud');
const Event = require('../../models/event/form');

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

exports.getEvents = async (req, res) => {
  const { pageNo, limit = 9 } = req.query;

  const events = await Event.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * limit)
    .limit(limit);

  const count = await Event.countDocuments();

  res.json({
    events: events.map((event) => {
      return {
        id: event._id,
        name: event.name,
        desc: event.desc,
        date: event.date,
        location: event.location,
        categories: event.categories,
        price: event.price,
        postedBy: event.postedBy,
        organizer: event.organizer,
        thumbnail: event.thumbnail,
      };
    }),
    count,
  });
};
