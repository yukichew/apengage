const mongoose = require('mongoose');
const { fieldSchema } = require('./form');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    thumbnail: {
      type: Object,
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fields: [fieldSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
