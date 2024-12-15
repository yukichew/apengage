const Event = require('../../models/event/form');

exports.getEvents = async (req, res) => {
  const { pageNo = 0, limit = 9, mode, categories } = req.query;

  const query = { isActive: true };
  if (mode) query.mode = mode;
  if (categories) query.categories = categories;

  const events = await Event.find(query)
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));

  const count = await Event.countDocuments(query);

  res.json({
    events: events.map((event) => {
      return {
        id: event._id,
        name: event.name,
        desc: event.desc,
        mode: event.mode,
        venue: event.venue,
        startTime: event.startTime,
        endTime: event.endTime,
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

exports.searchEvents = async (req, res) => {
  const { query } = req;

  const events = await Event.find({
    name: { $regex: query.name, $options: 'i' },
  });

  res.json({
    events: events.map((event) => {
      return {
        id: event._id,
        name: event.name,
        desc: event.desc,
        mode: event.mode,
        venue: event.venue,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location,
        categories: event.categories,
        price: event.price,
        postedBy: event.postedBy,
        organizer: event.organizer,
        thumbnail: event.thumbnail,
      };
    }),
  });
};

exports.getLatestEvents = async (req, res) => {
  const events = await Event.find({}).sort({ createdAt: -1 }).limit(5);

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
  });
};

// Admin only
exports.getAllEvents = async (req, res) => {
  const { pageNo = 0, limit = 9, ...filters } = req.query;

  const query = { ...filters };

  const events = await Event.find(query)
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));

  const count = await Event.countDocuments(query);

  res.json({
    events: events.map((event) => {
      return {
        id: event._id,
        name: event.name,
        desc: event.desc,
        mode: event.mode,
        venue: event.venue,
        startTime: event.startTime,
        endTime: event.endTime,
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
