const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['public', 'private'],
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    mode: {
      type: String,
      required: true,
      enum: ['online', 'oncampus', 'offcampus'],
    },
    categories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Category',
    },
    location: {
      type: String,
      trim: true,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VenueBooking',
    },
    price: {
      type: Number,
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
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organizer: {
      type: String, // e.g., 'APU E-Sports Club'
      required: true,
      trim: true,
    },
    fields: [
      {
        label: { type: String, required: true, trim: true },
        required: { type: Boolean, default: false },
        desc: { type: String, trim: true },
        type: {
          type: String,
          required: true,
          enum: [
            'short_ans',
            'long_ans',
            'mcq',
            'checkbox',
            'dropdown',
            'file',
          ],
        },
        options: { type: [String] },
        order: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
