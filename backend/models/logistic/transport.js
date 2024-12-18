const mongoose = require('mongoose');

const transportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Bus', 'Van'],
    },
    capacity: {
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

// transportSchema.statics.isAvailable = async function (
//   transportId,
//   startTime,
//   endTime
// ) {
//   const bookings = await this.model('TransportBooking').find({
//     transport: transportId,
//     $or: [
//       { startTime: { $lt: endTime, $gte: startTime } },
//       { endTime: { $gt: startTime, $lte: endTime } },
//       { startTime: { $lte: startTime }, endTime: { $gte: endTime } },
//     ],
//   });
//   return bookings.length === 0;
// };

module.exports = mongoose.model('Transport', transportSchema);
