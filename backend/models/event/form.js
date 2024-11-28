const mongoose = require('mongoose');

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
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organizer: {
      type: String,
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
    // fields: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Field',
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
