const Event = require('../../models/event');
const cloudinary = require('../../config/cloud');
const { sendError } = require('../../helpers/error');
const VenueBooking = require('../../models/logistic/venue/venueBooking');
const Form = require('../../models/event/form');
const { isValidObjectId, default: mongoose } = require('mongoose');

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

  const match = { status: 'Approved', type: 'public' };
  if (mode) match.mode = mode;

  const events = await Event.aggregate([
    { $match: match },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'venuebookings',
        localField: 'venueBooking',
        foreignField: '_id',
        as: 'venueBooking',
      },
    },
    { $unwind: { path: '$venueBooking', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'venues',
        localField: 'venueBooking.venue',
        foreignField: '_id',
        as: 'venueBooking.venue',
      },
    },
    {
      $unwind: {
        path: '$venueBooking.venue',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'postedBy',
        foreignField: '_id',
        as: 'postedBy',
      },
    },
    { $unwind: { path: '$postedBy', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'categories',
        localField: 'categories',
        foreignField: '_id',
        as: 'categories',
      },
    },
    {
      $lookup: {
        from: 'eventforms',
        localField: '_id',
        foreignField: 'event',
        as: 'forms',
      },
    },
    { $match: { 'forms.0': { $exists: true } } },
    {
      $project: {
        id: '$_id',
        name: 1,
        desc: 1,
        type: 1,
        mode: 1,
        venue: '$venueBooking.venue.name',
        startTime: 1,
        endTime: 1,
        location: 1,
        categories: '$categories.name',
        price: 1,
        postedBy: '$postedBy.apkey',
        organizer: 1,
        thumbnail: '$thumbnail.url',
        createdAt: 1,
        updatedAt: 1,
        status: 1,
      },
    },
  ]);

  const count = events.length;

  res.json({
    events,
    count,
  });
};

exports.searchEvents = async (req, res) => {
  const userRole = req.user.role;
  const { name, categories } = req.query;

  const match = {};
  if (userRole === 'user') {
    match.status = 'Approved';
    match.type = 'public';
  }

  if (categories) {
    match.categories = {
      $in: categories
        .split(',')
        .map((id) => mongoose.Types.ObjectId.createFromHexString(id)),
    };
  }

  if (name) {
    match.name = { $regex: name, $options: 'i' };
  }

  console.log('Match Object:', match);

  const events = await Event.aggregate([
    { $match: match },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'venuebookings',
        localField: 'venueBooking',
        foreignField: '_id',
        as: 'venueBooking',
      },
    },
    { $unwind: { path: '$venueBooking', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'venues',
        localField: 'venueBooking.venue',
        foreignField: '_id',
        as: 'venueBooking.venue',
      },
    },
    {
      $unwind: {
        path: '$venueBooking.venue',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'postedBy',
        foreignField: '_id',
        as: 'postedBy',
      },
    },
    { $unwind: { path: '$postedBy', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'categories',
        localField: 'categories',
        foreignField: '_id',
        as: 'categories',
      },
    },
    {
      $lookup: {
        from: 'eventforms',
        localField: '_id',
        foreignField: 'event',
        as: 'forms',
      },
    },

    ...(userRole === 'user'
      ? [{ $match: { 'forms.0': { $exists: true } } }]
      : []),
    {
      $project: {
        id: '$_id',
        name: 1,
        desc: 1,
        type: 1,
        mode: 1,
        venue: '$venueBooking.venue.name',
        startTime: 1,
        endTime: 1,
        location: 1,
        categories: '$categories.name',
        price: 1,
        postedBy: '$postedBy.apkey',
        organizer: 1,
        thumbnail: '$thumbnail.url',
        createdAt: 1,
        updatedAt: 1,
        status: 1,
      },
    },
  ]);

  const count = events.length;

  res.json({
    events,
    count,
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
      venue: event?.venueBooking?.venue?.name,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event?.location,
      categories: event?.categories,
      price: event?.price,
      postedBy: event.postedBy.apkey,
      organizer: event.organizer,
      thumbnail: event?.thumbnail?.url,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      status: event.status,
    },
  });
};

exports.getCreatedEvents = async (req, res) => {
  const userId = req.user._id;

  const events = await Event.aggregate([
    { $match: { postedBy: userId } },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'venuebookings',
        localField: 'venueBooking',
        foreignField: '_id',
        as: 'venueBooking',
      },
    },
    { $unwind: { path: '$venueBooking', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'venues',
        localField: 'venueBooking.venue',
        foreignField: '_id',
        as: 'venueBooking.venue',
      },
    },
    {
      $unwind: {
        path: '$venueBooking.venue',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'postedBy',
        foreignField: '_id',
        as: 'postedBy',
      },
    },
    { $unwind: { path: '$postedBy', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'eventforms',
        localField: '_id',
        foreignField: 'event',
        as: 'forms',
      },
    },
    {
      $project: {
        id: '$_id',
        name: 1,
        desc: 1,
        type: 1,
        mode: 1,
        venue: '$venueBooking.venue.name',
        startTime: 1,
        endTime: 1,
        location: 1,
        categories: 1,
        price: 1,
        postedBy: '$postedBy.apkey',
        organizer: 1,
        thumbnail: '$thumbnail.url',
        createdAt: 1,
        updatedAt: 1,
        status: 1,
        form: {
          $cond: {
            if: { $gt: [{ $size: '$forms' }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
  ]);

  const count = await Event.countDocuments({ postedBy: userId });

  res.json({
    events,
    count,
  });
};

exports.getCreatedActiveEvents = async (req, res) => {
  const userId = req.user._id;
  const query = {
    postedBy: userId,
    status: { $nin: ['Past', 'Rejected'] },
    mode: 'online',
  };

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

exports.udpateEventStatus = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid event id');

  const event = await Event.findById(id);
  if (!event) return sendError(res, 404, 'Event not found');

  if (action === 'approve') {
    event.status = 'Approved';
    await event.save();
    return res.json({ message: 'Event approved' });
  }

  if (action === 'reject') {
    event.status = 'Rejected';
    await event.save();
    return res.json({ message: 'Event rejected' });
  }

  res.status(400).json({ message: 'Invalid action' });
};

exports.searchCreatedEvents = async (req, res) => {
  const userId = req.user._id;
  const { name } = req.query;

  const matchCriteria = { postedBy: userId };
  if (name) {
    matchCriteria.name = { $regex: name, $options: 'i' };
  }

  const events = await Event.aggregate([
    { $match: matchCriteria },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'venuebookings',
        localField: 'venueBooking',
        foreignField: '_id',
        as: 'venueBooking',
      },
    },
    { $unwind: { path: '$venueBooking', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'venues',
        localField: 'venueBooking.venue',
        foreignField: '_id',
        as: 'venueBooking.venue',
      },
    },
    {
      $unwind: {
        path: '$venueBooking.venue',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'postedBy',
        foreignField: '_id',
        as: 'postedBy',
      },
    },
    { $unwind: { path: '$postedBy', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'eventforms',
        localField: '_id',
        foreignField: 'event',
        as: 'forms',
      },
    },
    {
      $project: {
        id: '$_id',
        name: 1,
        desc: 1,
        type: 1,
        mode: 1,
        venue: '$venueBooking.venue.name',
        startTime: 1,
        endTime: 1,
        location: 1,
        categories: 1,
        price: 1,
        postedBy: '$postedBy.apkey',
        organizer: 1,
        thumbnail: '$thumbnail.url',
        createdAt: 1,
        updatedAt: 1,
        status: 1,
        form: {
          $cond: {
            if: { $gt: [{ $size: '$forms' }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
  ]);

  const count = await Event.countDocuments(matchCriteria);

  res.json({
    events,
    count,
  });
};

exports.searchVenueUtilization = async (req, res) => {
  const { name } = req.query;

  const matchStage = {
    $match: { mode: 'oncampus', status: 'Past' },
  };

  if (name) {
    matchStage.$match['venueDetails.name'] = {
      $regex: name,
      $options: 'i',
    };
  }

  const statistics = await Event.aggregate([
    matchStage,
    {
      $lookup: {
        from: 'venuebookings',
        localField: 'venueBooking',
        foreignField: '_id',
        as: 'venueBookingDetails',
      },
    },
    {
      $unwind: {
        path: '$venueBookingDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'venues',
        localField: 'venueBookingDetails.venue',
        foreignField: '_id',
        as: 'venueDetails',
      },
    },
    {
      $unwind: { path: '$venueDetails', preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: 'eventforms',
        localField: '_id',
        foreignField: 'event',
        as: 'eventFormDetails',
      },
    },
    {
      $unwind: { path: '$eventFormDetails', preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: 'registrations',
        localField: 'eventFormDetails._id',
        foreignField: 'eventForm',
        as: 'registrations',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'postedBy',
        foreignField: '_id',
        as: 'postedByDetails',
      },
    },
    {
      $unwind: { path: '$postedByDetails', preserveNullAndEmptyArrays: true },
    },
    {
      $addFields: {
        participantCount: { $size: '$registrations' },
        wastedCapacity: {
          $subtract: ['$venueDetails.capacity', { $size: '$registrations' }],
        },
      },
    },
    {
      $project: {
        id: '$_id',
        name: 1,
        organizer: 1,
        startTime: 1,
        endTime: 1,
        mode: 1,
        type: 1,
        participantCount: 1,
        wastedCapacity: 1,
        status: 1,
        postedBy: '$postedByDetails.apkey',
        venue: '$venueDetails.name',
        venueType: '$venueDetails.type',
        venueCapacity: '$venueDetails.capacity',
        createdAt: 1,
        updatedAt: 1,
      },
    },
    {
      $match: {
        $expr: { $gt: ['$wastedCapacity', { $divide: ['$venueCapacity', 2] }] },
      },
    },
  ]);

  res.json({
    statistics: statistics.map((stat) => ({
      id: stat.id,
      name: stat.name,
      organizer: stat.organizer,
      participant: stat.participantCount,
      wastedCapacity: stat.wastedCapacity,
      venue: stat.venue,
      venueType: stat.venueType,
      venueCapacity: stat.venueCapacity,
      startTime: stat.startTime,
      endTime: stat.endTime,
      mode: stat.mode,
      type: stat.type,
      postedBy: stat.postedBy,
      createdAt: stat.createdAt,
      updatedAt: stat.updatedAt,
      status: stat.status,
    })),
    count: statistics.length,
  });
};

exports.updateEvent = async (req, res) => {
  const { name, desc } = req.body;

  const { id } = req.params;
  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid event id');

  const event = await Event.findById(id);
  if (!event) return sendError(res, 404, 'Event not found');

  event.name = name;
  event.desc = desc;

  await event.save();

  res.json({
    event: {
      id: event._id,
      name: event.name,
      desc: event.desc,
      type: event.type,
      mode: event.mode,
      venue: event?.venueBooking?.venue?.name,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event?.location,
      categories: event?.categories,
      price: event?.price,
      postedBy: event.postedBy.apkey,
      organizer: event.organizer,
      thumbnail: event?.thumbnail?.url,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      status: event.status,
    },
  });
};
