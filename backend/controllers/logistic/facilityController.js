const { isValidObjectId } = require('mongoose');
const { sendError } = require('../../helpers/error');
const Facility = require('../../models/logistic/facility');
const FacilityBooking = require('../../models/logistic/facility/facilityBooking');
const VenueBooking = require('../../models/logistic/venue/venueBooking');

// facility
exports.createFacility = async (req, res) => {
  const { name, type, quantity } = req.body;

  const facility = await Facility.findOne({ name });
  if (facility) {
    return res.status(400).json({ error: 'Facility name already exists' });
  }

  const newFacility = new Facility({
    name,
    type,
    quantity,
  });

  await newFacility.save();

  res.json({
    facility: {
      id: newFacility._id,
      name: newFacility.name,
      type: newFacility.type,
      quantity: newFacility.quantity,
    },
  });
};

exports.updateFacility = async (req, res) => {
  const { name, type, quantity } = req.body;
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid facility id');

  const facility = await Facility.findById(id);
  if (!facility) return sendError(res, 404, 'Facility not found');

  facility.name = name;
  facility.type = type;
  facility.quantity = quantity;

  await facility.save();

  res.json({
    facility: {
      id: facility._id,
      name: facility.name,
      type: facility.type,
      quantity: facility.quantity,
    },
  });
};

exports.deleteFacility = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid Facility id');

  const facility = await Facility.findById(id);
  if (!facility) return sendError(res, 404, 'Facility not found');

  await Facility.findByIdAndDelete(id);

  res.json({ message: 'Facility deleted' });
};

exports.getFacilities = async (req, res) => {
  const facilities = await Facility.find({}).sort({ createdAt: -1 });
  const count = await Facility.countDocuments();
  res.json({
    facilities: facilities.map((facility) => {
      return {
        id: facility._id,
        name: facility.name,
        type: facility.type,
        quantity: facility.quantity,
        status: facility.isActive ? 'Active' : 'Inactive',
        createdAt: facility.createdAt,
        updatedAt: facility.updatedAt,
      };
    }),
    count,
  });
};

exports.getFacility = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid Facility id');

  const facility = await Facility.findById(id);
  if (!facility) return sendError(res, 404, 'Facility not found');

  res.json({
    facility: {
      id: facility._id,
      name: facility.name,
      type: facility.type,
      quantity: facility.quantity,
      status: facility.isActive ? 'Active' : 'Inactive',
    },
  });
};

exports.searchFacility = async (req, res) => {
  const { name, type } = req.query;

  const query = {
    name: { $regex: name, $options: 'i' },
  };

  if (type) {
    query.type = type;
  }

  const result = await Facility.find(query);

  res.json({
    facilities: result.map((facility) => {
      return {
        id: facility._id,
        name: facility.name,
        type: facility.type,
        quantity: facility.quantity,
        status: facility.isActive ? 'Active' : 'Inactive',
        createdAt: facility.createdAt,
        updatedAt: facility.updatedAt,
      };
    }),
  });
};

// facility bookings
exports.bookFacility = async (req, res) => {
  const { facilityId, startTime, endTime, venueBookingId, quantity } = req.body;
  if (!isValidObjectId(facilityId))
    return sendError(res, 401, 'Invalid Facility id');

  const facility = await Facility.findById(facilityId);
  if (!facility) return sendError(res, 404, 'Facility not found');

  const venueBooking = await VenueBooking.findById(venueBookingId).populate(
    'venue'
  );
  if (!venueBooking) return sendError(res, 404, 'Venue booking not found');

  if (
    new Date(startTime) < new Date(venueBooking.startTime) ||
    new Date(endTime) > new Date(venueBooking.endTime)
  ) {
    return sendError(
      res,
      400,
      'Facility booking time must be within the venue booking time range.'
    );
  }

  const isAvailable = await Facility.isAvailable(
    facility,
    startTime,
    endTime,
    quantity
  );
  if (!isAvailable)
    return sendError(
      res,
      400,
      'Facility is not available for the selected time slot.'
    );

  const currentTime = new Date();
  const bookingStartTime = new Date(startTime);
  const timeDifference = bookingStartTime - currentTime;
  const hoursDifference = timeDifference / (1000 * 60 * 60);

  let bookingStatus = hoursDifference > 48 ? 'Approved' : 'Pending';
  if (venueBooking.status === 'Pending') {
    bookingStatus = 'Pending';
  }

  const newBooking = new FacilityBooking({
    facility: facilityId,
    startTime,
    endTime,
    venueBooking,
    quantity,
    createdBy: req.user.id,
    status: bookingStatus,
  });

  await newBooking.save();

  res.json({
    booking: {
      id: newBooking._id,
      facility: newBooking.facility,
      startTime: newBooking.startTime,
      endTime: newBooking.endTime,
      quantity: newBooking.quantity,
      venueBooking: newBooking.venueBooking,
      createdBy: newBooking.createdBy,
    },
  });
};

exports.getFacilityBookings = async (req, res) => {
  const userRole = req.user.role;
  const userId = req.user._id;

  let bookings;
  let count;

  if (userRole === 'admin') {
    bookings = await FacilityBooking.find({})
      .sort({ createdAt: -1 })
      .populate('facility', 'name type')
      .populate('createdBy', 'apkey fullname email contact')
      .populate({
        path: 'venueBooking',
        populate: {
          path: 'venue',
          select: 'name',
        },
      });

    count = await FacilityBooking.countDocuments();
  } else {
    bookings = await FacilityBooking.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .populate('facility', 'name')
      .populate('createdBy', 'apkey')
      .populate({
        path: 'venueBooking',
        populate: {
          path: 'venue',
          select: 'name',
        },
      });

    count = await FacilityBooking.countDocuments({ createdBy: userId });
  }

  res.json({
    bookings: bookings.map((booking) => ({
      id: booking._id,
      facility: booking.facility.name,
      facilityType: booking.facility.type,
      quantity: booking.quantity,
      startTime: booking.startTime,
      endTime: booking.endTime,
      venueBooking: booking.venueBooking.venue.name,
      createdBy: booking.createdBy.apkey.toUpperCase(),
      userEmail: booking.createdBy.email,
      userContact: booking.createdBy.contact,
      userFullname: booking.createdBy.fullname,
      createdAt: booking.createdAt,
      status: booking.status,
    })),
    count,
  });
};

// admin only
exports.udpateFacilityBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  if (!isValidObjectId(id))
    return sendError(res, 401, 'Invalid facility booking id');

  const booking = await FacilityBooking.findById(id);
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

exports.searchFacilityBookings = async (req, res) => {
  const { name } = req.query;

  const facilities = await Facility.find({
    name: { $regex: name, $options: 'i' },
  });

  const facilityIds = facilities.map((facility) => facility._id);

  const bookings = await FacilityBooking.find({
    facility: { $in: facilityIds },
  })
    .sort({ createdAt: -1 })
    .populate('facility', 'name type')
    .populate('createdBy', 'apkey fullname email contact')
    .populate({
      path: 'venueBooking',
      populate: {
        path: 'venue',
        select: 'name',
      },
    });

  res.json({
    bookings: bookings.map((booking) => ({
      id: booking._id,
      facility: booking.facility.name,
      facilityType: booking.facility.type,
      quantity: booking.quantity,
      startTime: booking.startTime,
      endTime: booking.endTime,
      venueBooking: booking.venueBooking.venue.name,
      createdBy: booking.createdBy.apkey.toUpperCase(),
      userEmail: booking.createdBy.email,
      userContact: booking.createdBy.contact,
      userFullname: booking.createdBy.fullname,
      createdAt: booking.createdAt,
      status: booking.status,
    })),
    count: bookings.length,
  });
};
