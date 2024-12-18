const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String, // 'Auditorium', 'Classroom'
      required: true,
      trim: true,
    },
    opacity: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

venueSchema.statics.isAvailable = async function (venueId, startTime, endTime) {
  const bookings = await this.model('VenueBooking').find({
    venue: venueId,
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
      { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
    ],
  });
  return bookings.length === 0;
};

module.exports = mongoose.model('Venue', venueSchema);
