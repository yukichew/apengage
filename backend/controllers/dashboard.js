const User = require('../models/auth/user');
const Event = require('../models/event');
const VenueBooking = require('../models/logistic/venue/venueBooking');
const FacilityBooking = require('../models/logistic/facility/facilityBooking');
const TransportBooking = require('../models/logistic/transport/transportBooking');

exports.getDashboardData = async (req, res) => {
  const totalEvents = await Event.countDocuments();
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalAdmins = await User.countDocuments({ role: 'admin' });
  const totalVenueBookings = await VenueBooking.countDocuments();
  const totalFacilityBookings = await FacilityBooking.countDocuments();
  const totalTransportBookings = await TransportBooking.countDocuments();

  const eventStatusCounts = await Event.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const userStatusCounts = await User.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const venueBookingStatusCounts = await VenueBooking.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const facilityBookingStatusCounts = await FacilityBooking.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const transportBookingStatusCounts = await TransportBooking.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const formatCounts = (data, statuses) => {
    let formatted = {};
    statuses.forEach((status) => {
      formatted[status] = 0;
    });
    data.forEach((item) => {
      formatted[item._id] = item.count;
    });
    return formatted;
  };

  const eventStatuses = ['Pending', 'Approved', 'Rejected', 'Past'];
  const userStatuses = ['Active', 'Inactive', 'Pending'];
  const bookingStatuses = ['Pending', 'Approved', 'Rejected'];

  res.json({
    totalEvents,
    totalUsers,
    totalAdmins,
    totalVenueBookings,
    totalFacilityBookings,
    totalTransportBookings,
    events: formatCounts(eventStatusCounts, eventStatuses),
    users: formatCounts(userStatusCounts, userStatuses),
    venueBookings: formatCounts(venueBookingStatusCounts, bookingStatuses),
    facilityBookings: formatCounts(
      facilityBookingStatusCounts,
      bookingStatuses
    ),
    transportBookings: formatCounts(
      transportBookingStatusCounts,
      bookingStatuses
    ),
  });
};
