const mongoose = require('mongoose');

exports.fieldSchema = new mongoose.Schema(
  {
    required: {
      type: Boolean,
      default: false,
      required: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'short_ans',
        'long_ans',
        'mcq',
        'checkbox',
        'dropdown',
        'date',
        'time',
        'file',
      ],
    },
    options: {
      type: [String],
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
