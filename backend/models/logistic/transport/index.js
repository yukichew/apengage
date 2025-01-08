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

transportSchema.statics.findAvailable = async function (type, dateRange) {
  const { departDate, returnDate } = dateRange;

  const allTransports = await this.find({ type, isActive: true });

  const unavailableTransports = await this.model('TransportBooking')
    .find({
      $or: [
        {
          'transport.departure': { $in: allTransports.map((t) => t._id) },
          departDate: { $lte: departDate },
          returnDate: { $gte: departDate },
        },
        {
          'transport.return': { $in: allTransports.map((t) => t._id) },
          departDate: { $lte: returnDate },
          returnDate: { $gte: returnDate },
        },
      ],
    })
    .select('transport.departure transport.return');

  const unavailableIds = [
    ...new Set(
      unavailableTransports.flatMap((booking) => [
        booking.transport.departure,
        booking.transport.return,
      ])
    ),
  ];

  return this.find({ type, _id: { $nin: unavailableIds }, isActive: true });
};

module.exports = mongoose.model('Transport', transportSchema);
