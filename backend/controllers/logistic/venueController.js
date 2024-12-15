const { isValidObjectId } = require('mongoose');
const { sendError } = require('../../helpers/error');
const Venue = require('../../models/logistic/venue');
const VenueBooking = require('../../models/logistic/venueBooking');

exports.createVenue = async (req, res) => {
  const { name, type, opacity } = req.body;

  const newVenue = new Venue({
    name,
    type,
    opacity,
  });

  await newVenue.save();

  res.json({
    venue: {
      id: newVenue._id,
      name: newVenue.name,
      type: newVenue.type,
      opacity: newVenue.opacity,
    },
  });
};

exports.updateVenue = async (req, res) => {
  const { name, type, opacity } = req.body;
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid venue id');

  const venue = await Venue.findById(id);
  if (!venue) return sendError(res, 404, 'Venue not found');

  venue.name = name;
  venue.type = type;
  venue.opacity = opacity;

  await venue.save();

  res.json({
    venue: {
      id: venue._id,
      name: venue.name,
      type: venue.type,
      opacity: venue.opacity,
    },
  });
};

exports.deleteVenue = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid Venue id');

  const venue = await Venue.findById(id);
  if (!venue) return sendError(res, 404, 'Venue not found');

  await Venue.findByIdAndDelete(id);

  res.json({ message: 'Venue deleted' });
};

exports.getVenues = async (req, res) => {
  const { pageNo, limit = 9 } = req.query;

  const venues = await Venue.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * limit)
    .limit(limit);

  const count = await Venue.countDocuments();

  res.json({
    venues: venues.map((venue) => {
      return {
        id: venue._id,
        name: venue.name,
        type: venue.type,
        opacity: venue.opacity,
        isActve: venue.isActive,
      };
    }),
    count,
  });
};

exports.getVenue = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid Venue id');

  const venue = await Venue.findById(id);
  if (!venue) return sendError(res, 404, 'Venue not found');

  res.json({
    venue: {
      id: venue._id,
      name: venue.name,
      type: venue.type,
      opacity: venue.opacity,
      isActve: venue.isActive,
    },
  });
};

exports.searchVenue = async (req, res) => {
  const { query } = req.query;

  const result = await Venue.find({
    name: { $regex: query.name, $options: 'i' },
  });

  res.json({
    venues: result.map((venue) => {
      return {
        id: venue._id,
        name: venue.name,
        type: venue.type,
        opacity: venue.opacity,
        isActve: venue.isActive,
      };
    }),
  });
};

exports.bookVenue = async (req, res) => {
  const { venueId, startTime, endTime, purpose } = req.body;
  if (!isValidObjectId(venueId)) return sendError(res, 401, 'Invalid Venue id');

  const venue = await Venue.findById(venueId);
  if (!venue) return sendError(res, 404, 'Venue not found');

  const isAvailable = await Venue.isAvailable(venueId, startTime, endTime);
  if (!isAvailable)
    return sendError(
      res,
      400,
      'Venue is not available for the selected time slot'
    );

  const newBooking = new VenueBooking({
    venue: venueId,
    startTime,
    endTime,
    purpose,
    createdBy: req.user.id,
  });

  await newBooking.save();

  res.json({
    booking: {
      id: newBooking._id,
      venue: newBooking.venue,
      startTime: newBooking.startTime,
      endTime: newBooking.endTime,
      purpose: newBooking.purpose,
      createdBy: newBooking.createdBy,
    },
  });
};
