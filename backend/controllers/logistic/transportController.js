const { isValidObjectId } = require('mongoose');
const { sendError } = require('../../helpers/error');
const Transport = require('../../models/logistic/transport');
const TransportBooking = require('../../models/logistic/transport/transportBooking');
const Event = require('../../models/event/form');

// transport
exports.createTransport = async (req, res) => {
  const { name, type, capacity } = req.body;

  const transport = await Transport.findOne({ name });
  if (transport) {
    return res.status(400).json({ error: 'Transport name already exists' });
  }

  const newTransport = new Transport({
    name: name.toUpperCase(),
    type,
    capacity,
  });

  await newTransport.save();

  res.json({
    Transport: {
      id: newTransport._id,
      name: newTransport.name,
      type: newTransport.type,
      capacity: newTransport.capacity,
    },
  });
};

exports.updateTransport = async (req, res) => {
  const { name, type, capacity } = req.body;
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid transport id');

  const transport = await Transport.findById(id);
  if (!transport) return sendError(res, 404, 'Transport not found');

  transport.name = name;
  transport.type = type;
  transport.capacity = capacity;

  await transport.save();

  res.json({
    transport: {
      id: transport._id,
      name: transport.name,
      type: transport.type,
      capacity: transport.capacity,
    },
  });
};

exports.deleteTransport = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid transport id');

  const transport = await Transport.findById(id);
  if (!transport) return sendError(res, 404, 'Transport not found');

  await Transport.findByIdAndDelete(id);

  res.json({ message: 'Transport deleted' });
};

exports.getTransportation = async (req, res) => {
  const transportation = await Transport.find({}).sort({ createdAt: -1 });
  const count = await Transport.countDocuments();
  res.json({
    transportation: transportation.map((transport) => {
      return {
        id: transport._id,
        name: transport.name,
        type: transport.type,
        capacity: transport.capacity,
        status: transport.isActive ? 'Active' : 'Inactive',
        createdAt: transport.createdAt,
        updatedAt: transport.updatedAt,
      };
    }),
    count,
  });
};

exports.getTransport = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid transport id');

  const transport = await Transport.findById(id);
  if (!transport) return sendError(res, 404, 'Transport not found');

  res.json({
    transport: {
      id: transport._id,
      name: transport.name,
      type: transport.type,
      capacity: transport.capacity,
      status: transport.isActive ? 'Active' : 'Inactive',
    },
  });
};

exports.searchTransport = async (req, res) => {
  const { name, type } = req.query;

  const query = {
    name: { $regex: name, $options: 'i' },
  };

  if (type) {
    query.type = type;
  }

  const result = await Transport.find(query);

  res.json({
    transportation: result.map((transport) => {
      return {
        id: transport._id,
        name: transport.name,
        type: transport.type,
        capacity: transport.capacity,
        status: transport.isActive ? 'Active' : 'Inactive',
        createdAt: transport.createdAt,
        updatedAt: transport.updatedAt,
      };
    }),
  });
};

// transportation bookings
exports.bookTransport = async (req, res) => {
  const {
    transportType,
    departFrom,
    departTo,
    returnTo,
    departDate,
    returnDate,
    eventId,
  } = req.body;

  const event = await Event.findById(eventId);
  if (!event) return sendError(res, 404, 'Event not found');

  const availableDepartTransports = await Transport.findAvailable(
    transportType,
    departDate
  );
  const availableReturnTransports = await Transport.findAvailable(
    transportType,
    returnDate
  );

  if (availableDepartTransports.length === 0) {
    return sendError(res, 400, 'No transport available for departure');
  }

  if (returnDate && availableReturnTransports.length === 0) {
    return sendError(res, 400, 'No transport available for return');
  }

  let assignedDepartTransport = availableDepartTransports[0];
  let assignedReturnTransport =
    availableReturnTransports.find((t) =>
      t._id.equals(assignedDepartTransport._id)
    ) || availableReturnTransports[0];

  const currentTime = new Date();
  const bookingStartTime = new Date(departDate);
  const timeDifference = bookingStartTime - currentTime;
  const hoursDifference = timeDifference / (1000 * 60 * 60);

  const newBooking = new TransportBooking({
    departFrom,
    departTo,
    returnTo,
    departDate,
    returnDate,
    createdBy: req.user.id,
    transport: {
      departure: assignedDepartTransport._id,
      return: assignedReturnTransport ? assignedReturnTransport._id : null,
    },
    event: eventId,
    status: hoursDifference > 48 ? 'Approved' : 'Pending',
  });

  await newBooking.save();

  res.json({
    booking: {
      id: newBooking._id,
      transport: {
        departure: assignedDepartTransport.name,
        return: assignedReturnTransport ? assignedReturnTransport.name : null,
      },
      departFrom: newBooking.departFrom,
      departTo: newBooking.departTo,
      returnTo: newBooking.returnTo,
      departDate: newBooking.departDate,
      returnDate: newBooking.returnDate,
      event: newBooking.event,
      status: newBooking.status,
      createdBy: req.user.id,
      createdAt: newBooking.createdAt,
    },
  });
};

exports.getTransportBookings = async (req, res) => {
  const bookings = await TransportBooking.find({})
    .sort({ createdAt: -1 })
    .populate('transport.departure', 'type')
    .populate('event', 'name')
    .populate('createdBy', 'apkey');

  const count = await TransportBooking.countDocuments();

  res.json({
    bookings: bookings.map((booking) => {
      return {
        id: booking._id,
        transport: booking.transport.departure.type,
        departFrom: booking.departFrom,
        departTo: booking.departTo,
        returnTo: booking.returnTo,
        departDate: booking.departDate,
        returnDate: booking.returnDate,
        event: booking.event.name,
        status: booking.status,
        createdBy: booking.createdBy.apkey.toUpperCase(),
        createdAt: booking.createdAt,
      };
    }),
    count,
  });
};

exports.updateTransportBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  if (!isValidObjectId(id))
    return sendError(res, 401, 'Invalid transport booking id');

  const booking = await TransportBooking.findById(id);
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