const { isValidObjectId } = require('mongoose');
const { sendError } = require('../../helpers/error');
const Venue = require('../../models/logistic/venue');
const VenueBooking = require('../../models/logistic/venue/venueBooking');
const venue = require('../../models/logistic/venue');
const user = require('../../models/auth/user');

// venue
exports.createVenue = async (req, res) => {
  const { name, type, capacity } = req.body;

  const venue = await Venue.findOne({ name });
  if (venue) {
    return res.status(400).json({ error: 'Venue name already exists' });
  }

  const newVenue = new Venue({
    name,
    type,
    capacity,
  });

  await newVenue.save();

  res.json({
    venue: {
      id: newVenue._id,
      name: newVenue.name,
      type: newVenue.type,
      capacity: newVenue.capacity,
    },
  });
};

exports.updateVenue = async (req, res) => {
  const { name, type, capacity } = req.body;
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid venue id');

  const venue = await Venue.findById(id);
  if (!venue) return sendError(res, 404, 'Venue not found');

  venue.name = name;
  venue.type = type;
  venue.capacity = capacity;

  await venue.save();

  res.json({
    venue: {
      id: venue._id,
      name: venue.name,
      type: venue.type,
      capacity: venue.capacity,
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
  const venues = await Venue.find({}).sort({ createdAt: -1 });
  const count = await Venue.countDocuments();
  res.json({
    venues: venues.map((venue) => {
      return {
        id: venue._id,
        name: venue.name,
        type: venue.type,
        capacity: venue.capacity,
        status: venue.isActive ? 'Active' : 'Inactive',
        createdAt: venue.createdAt,
        updatedAt: venue.updatedAt,
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
      capacity: venue.capacity,
      status: venue.isActive ? 'Active' : 'Inactive',
    },
  });
};

exports.searchVenue = async (req, res) => {
  const { name, type } = req.query;

  const query = {
    name: { $regex: name, $options: 'i' },
  };

  if (type) {
    query.type = type;
  }

  const result = await Venue.find(query);

  res.json({
    venues: result.map((venue) => {
      return {
        id: venue._id,
        name: venue.name,
        type: venue.type,
        capacity: venue.capacity,
        status: venue.isActive ? 'Active' : 'Inactive',
        createdAt: venue.createdAt,
        updatedAt: venue.updatedAt,
      };
    }),
  });
};

// venue bookings
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

  const currentTime = new Date();
  const bookingStartTime = new Date(startTime);
  const timeDifference = bookingStartTime - currentTime;
  const hoursDifference = timeDifference / (1000 * 60 * 60);

  const newBooking = new VenueBooking({
    venue: venueId,
    startTime,
    endTime,
    purpose,
    createdBy: req.user.id,
    status: hoursDifference > 48 ? 'Approved' : 'Pending',
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

exports.getVenueBookings = async (req, res) => {
  const userRole = req.user.role;
  const userId = req.user._id;

  let bookings;
  let count;
  if (userRole === 'admin') {
    bookings = await VenueBooking.find({})
      .sort({ createdAt: -1 })
      .populate('venue', 'name type capacity')
      .populate('createdBy', 'apkey fullname email contact');
    count = await VenueBooking.countDocuments();
  } else {
    bookings = await VenueBooking.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .populate('venue', 'name')
      .populate('createdBy', 'apkey');
    count = await VenueBooking.countDocuments({ createdBy: userId });
  }

  res.json({
    bookings: bookings.map((booking) => {
      return {
        id: booking._id,
        venue: booking.venue.name,
        venueType: booking.venue.type,
        venueCapacity: booking.venue.capacity,
        startTime: booking.startTime,
        endTime: booking.endTime,
        purpose: booking.purpose,
        createdBy: booking.createdBy.apkey.toUpperCase(),
        userEmail: booking.createdBy.email,
        userContact: booking.createdBy.contact,
        userFullname: booking.createdBy.fullname,
        createdAt: booking.createdAt,
        status: booking.status,
      };
    }),
    count,
  });
};

// admin only
exports.udpateVenueBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  if (!isValidObjectId(id))
    return sendError(res, 401, 'Invalid venue booking id');

  const booking = await VenueBooking.findById(id);
  if (!booking) return sendError(res, 404, 'Booking not found');

  if (action === 'approve') {
    booking.status = 'Approved';
    await booking.save();
    return res.json({ message: 'Booking approved' });
  }

  if (action === 'reject') {
    booking.status = 'Rejected';
    await booking.save();
    return res.json({ message: 'Booking rejected' });
  }

  res.status(400).json({ message: 'Invalid action' });
};

exports.searchVenueBookings = async (req, res) => {
  const { name } = req.query;

  const venues = await Venue.find({
    name: { $regex: name, $options: 'i' },
  });

  const venueIds = venues.map((venue) => venue._id);

  const bookings = await VenueBooking.find({
    venue: { $in: venueIds },
  })
    .sort({ createdAt: -1 })
    .populate('venue', 'name type capacity')
    .populate('createdBy', 'apkey fullname email contact');

  res.json({
    bookings: bookings.map((booking) => {
      return {
        id: booking._id,
        venue: booking.venue.name,
        venueType: booking.venue.type,
        venueCapacity: booking.venue.capacity,
        startTime: booking.startTime,
        endTime: booking.endTime,
        purpose: booking.purpose,
        createdBy: booking.createdBy.apkey.toUpperCase(),
        userEmail: booking.createdBy.email,
        userContact: booking.createdBy.contact,
        userFullname: booking.createdBy.fullname,
        createdAt: booking.createdAt,
        status: booking.status,
      };
    }),
    count: bookings.length,
  });
};
