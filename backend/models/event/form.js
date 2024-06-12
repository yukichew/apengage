const mongoose = require('mongoose');
const { fieldSchema } = require('./field');
const { categorySchema } = require('./category');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
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
    categories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Category',
      required: true,
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
    isActive: {
      type: Boolean,
      default: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fields: {
      type: [fieldSchema],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
