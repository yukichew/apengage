const mongoose = require('mongoose');

const facilityBookingSchema = new mongoose.Schema(
  {
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    venueBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VenueBooking',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Approved',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FacilityBooking', facilityBookingSchema);
