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
    description: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'text',
        'textarea',
        'select',
        'radio',
        'checkbox',
        'date',
        'time',
        'file',
      ],
    },
    options: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);
