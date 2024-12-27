const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['A/V', 'T/I', 'Electric Appliances', 'Other'],
    },
    quantity: {
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

facilitySchema.statics.isAvailable = async function (
  facilityId,
  startTime,
  endTime,
  requestedQuantity
) {
  const facility = await this.findById(facilityId);
  if (!facility) throw new Error('Facility not found');

  const bookings = await this.model('FacilityBooking').find({
    facility: facilityId,
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
      { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
    ],
  });

  const totalBookedQuantity = bookings.reduce(
    (total, booking) => total + booking.quantity,
    0
  );

  return totalBookedQuantity + requestedQuantity <= facility.quantity;
};

module.exports = mongoose.model('Facility', facilitySchema);
