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

transportSchema.statics.findAvailable = async function (type, date) {
  const allTransports = await this.find({ type, isActive: true });

  const unavailableTransports = await this.model('TransportBooking')
    .find({
      'transport.departure': { $in: allTransports.map((t) => t._id) },
      $or: [
        { departDate: { $lte: date }, returnDate: { $gte: date } },
        { departDate: date },
      ],
    })
    .select('transport.departure');

  const unavailableIds = unavailableTransports.map(
    (booking) => booking.transport.departure
  );

  return this.find({ type, _id: { $nin: unavailableIds }, isActive: true });
};

module.exports = mongoose.model('Transport', transportSchema);
