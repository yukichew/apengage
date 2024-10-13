const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
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
  submittedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Registration', registrationSchema);
