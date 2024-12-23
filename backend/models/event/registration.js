const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    eventForm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EventForm',
      required: true,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    response: {
      type: Object,
      required: true,
    },
    qrCode: {
      type: String,
    },
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Attended', 'Absent'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Registration', registrationSchema);
