const Event = require('../../models/event/form');

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
