const mongoose = require('mongoose');

const transportBookingSchema = new mongoose.Schema(
  {
    transport: {
      departure: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transport',
        required: true,
      },
      return: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transport',
      },
    },
    departFrom: {
      type: String,
      required: true,
      enum: ['APU Campus', 'Fortune Park', 'LRT Bukit Jalil'],
    },
    departTo: {
      type: String,
      required: true,
      trim: true,
    },
    returnTo: {
      type: String,
      required: true,
      enum: ['APU Campus', 'Fortune Park', 'LRT Bukit Jalil'],
    },
    departDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TransportBooking', transportBookingSchema);
