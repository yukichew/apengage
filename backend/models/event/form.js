const mongoose = require('mongoose');

const eventFormSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('EventForm', eventFormSchema);
