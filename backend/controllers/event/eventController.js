const Event = require('../../models/event');
const cloudinary = require('../../config/cloud');
const { sendError } = require('../../helpers/error');

exports.createEvent = async (req, res) => {
  const {
    name,
    desc,
    type,
    mode,
    startTime,
    endTime,
    price,
    venueBooking,
    location,
    categories,
    organizer,
  } = req.body;

  const { file } = req;
  const newEvent = new Event({
    name,
    desc,
    type,
    mode,
    venueBooking,
    startTime,
    endTime,
    location,
    categories,
    price,
    postedBy: req.user._id,
    organizer,
  });

  if (type === 'public' && !file) {
    return sendError(res, 400, 'Event poster is required for public events');
  }

  if (file) {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file.path
    );
    newEvent.thumbnail = { url, public_id };
  }

  await newEvent.save();

  res.json({ event: newEvent });
};

exports.getEvents = async (req, res) => {
  const { mode, categories } = req.query;

  const query = { status: 'Approved', type: 'public' };
  if (mode) query.mode = mode;
  if (categories) query.categories = categories;

  const events = await Event.find(query)
    .sort({ createdAt: -1 })
    .populate({
      path: 'venueBooking',
      populate: {
        path: 'venue',
        select: 'name',
      },
    })
    .populate('postedBy', 'apkey');

  const count = await Event.countDocuments(query);

  res.json({
    events: events.map((event) => {
      return {
        id: event._id,
        name: event.name,
        desc: event.desc,
        type: event.type,
        mode: event.mode,
        venue: event?.venueBooking.venue.name,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event?.location,
        categories: event?.categories,
        price: event?.price,
        postedBy: event.postedBy.apkey,
        organizer: event.organizer,
        thumbnail: event?.thumbnail.url,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        status: event.status,
      };
    }),
    count,
  });
};

exports.searchEvents = async (req, res) => {
  const { name } = req.query;

  const events = await Event.find({
    name: { $regex: name, $options: 'i' },
  })
    .populate({
      path: 'venueBooking',
      populate: {
        path: 'venue',
        select: 'name',
      },
    })
    .populate('postedBy', 'apkey');

  res.json({
    events: events.map((event) => {
      return {
        id: event._id,
        name: event.name,
        desc: event.desc,
        type: event.type,
        mode: event.mode,
        venue: event?.venueBooking.venue.name,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event?.location,
        categories: event?.categories,
        price: event?.price,
        postedBy: event.postedBy.apkey,
        organizer: event.organizer,
        thumbnail: event?.thumbnail.url,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        status: event.status,
      };
    }),
  });
};

exports.getLatestEvents = async (req, res) => {
  const events = await Event.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate({
      path: 'venueBooking',
      populate: {
        path: 'venue',
        select: 'name',
      },
    })
    .populate('postedBy', 'apkey');

  res.json({
    events: events.map((event) => {
      return {
        id: event._id,
        name: event.name,
        desc: event.desc,
        type: event.type,
        mode: event.mode,
        venue: event?.venueBooking.venue.name,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event?.location,
        categories: event?.categories,
        price: event?.price,
        postedBy: event.postedBy.apkey,
        organizer: event.organizer,
        thumbnail: event?.thumbnail,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        status: event.status,
      };
    }),
  });
};

// Admin only
exports.getAllEvents = async (req, res) => {
  const { ...filters } = req.query;

  const query = { ...filters };

  const events = await Event.find(query)
    .sort({ createdAt: -1 })
    .populate({
      path: 'venueBooking',
      populate: {
        path: 'venue',
        select: 'name',
      },
    })
    .populate('postedBy', 'apkey');

  const count = await Event.countDocuments(query);

  res.json({
    events: events.map((event) => {
      return {
        id: event._id,
        name: event.name,
        desc: event.desc,
        type: event.type,
        mode: event.mode,
        venue: event?.venueBooking.venue.name,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event?.location,
        categories: event?.categories,
        price: event?.price,
        postedBy: event.postedBy.apkey,
        organizer: event.organizer,
        thumbnail: event?.thumbnail.url,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        status: event.status,
      };
    }),
    count,
  });
};
