const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    required: {
      type: Boolean,
      default: false,
      required: true,
    },
    desc: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['short_ans', 'long_ans', 'mcq', 'checkbox', 'dropdown', 'file'],
    },
    options: {
      type: [String],
    },
    order: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Field', fieldSchema);
