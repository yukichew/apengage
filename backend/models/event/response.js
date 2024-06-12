const mongoose = require('mongoose');

const formResponseSchema = new mongoose.Schema({
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  response: {
    type: Object,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  submittedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('FormResponse', formResponseSchema);
