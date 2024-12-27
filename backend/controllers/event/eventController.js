const Event = require('../../models/event');
const cloudinary = require('../../config/cloud');
const { sendError } = require('../../helpers/error');
const VenueBooking = require('../../models/logistic/venue/venueBooking');

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

  console.log(req.body);

  const { file } = req;

  let eventStatus = 'Approved';
  if (venueBooking) {
    const venue = await VenueBooking.findById(venueBooking);
    if (!venue) return sendError(res, 404, 'Venue booking not found');
    if (venue.status === 'Pending') {
      eventStatus = 'Pending';
    }
  }

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
    status: eventStatus,
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
  const { mode } = req.query;

  const query = { status: 'Approved', type: 'public' };
  if (mode) query.mode = mode;

  const events = await Event.find(query)
    .sort({ createdAt: -1 })
    .populate({
      path: 'venueBooking',
      populate: {
        path: 'venue',
        select: 'name',
      },
    })
    .populate('postedBy', 'apkey')
    .populate('categories', 'name');

  const count = await Event.countDocuments(query);

  res.json({
    events: events.map((event) => {
      return {
        id: event._id,
        name: event.name,
        desc: event.desc,
        type: event.type,
        mode: event.mode,
        venue: event?.venueBooking?.venue.name,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event?.location,
        categories: event?.categories.map((category) => category.name),
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
  const userRole = req.user.role;
  const { name, categories } = req.query;

  const query = {
    name: { $regex: name, $options: 'i' },
  };

  if (userRole === 'user') {
    query.status = 'Approved';
    query.type = 'public';
  }

  if (categories) {
    query.categories = { $in: categories.split(',') };
  }

  const events = await Event.find(query)
    .populate({
      path: 'venueBooking',
      populate: {
        path: 'venue',
        select: 'name',
      },
    })
    .populate('postedBy', 'apkey')
    .populate('categories', 'name');

  res.json({
    events: events.map((event) => {
      return {
        id: event._id,
        name: event.name,
        desc: event.desc,
        type: event.type,
        mode: event.mode,
        venue: event?.venueBooking?.venue.name,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event?.location,
        categories: event?.categories.map((category) => category.name),
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
        venue: event?.venueBooking?.venue.name,
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

exports.getEvent = async (req, res) => {
  const { id } = req.params;

  const event = await Event.findById(id)
    .populate({
      path: 'venueBooking',
      populate: {
        path: 'venue',
        select: 'name',
      },
    })
    .populate('postedBy', 'apkey');

  if (!event) return sendError(res, 404, 'Event not found');

  res.json({
    event: {
      id: event._id,
      name: event.name,
      desc: event.desc,
      type: event.type,
      mode: event.mode,
      venue: event?.venueBooking?.venue.name,
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
    },
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
        venue: event?.venueBooking?.venue.name,
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

exports.getCreatedEvents = async (req, res) => {
  const userId = req.user._id;
  const query = { postedBy: userId };

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
        venue: event?.venueBooking?.venue.name,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event?.location,
        categories: event?.categories,
        price: event?.price,
        postedBy: event.postedBy.apkey,
        organizer: event.organizer,
        thumbnail: event.thumbnail?.url,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        status: event.status,
      };
    }),
    count,
  });
};
