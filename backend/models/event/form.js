const mongoose = require('mongoose');

const eventFormSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    deadline: { type: Date, required: true },
    fields: [
      {
        label: { type: String, required: true, trim: true },
        normalizedLabel: { type: String, trim: true },
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
        defaultField: { type: Boolean, default: false },
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

eventFormSchema.pre('save', function (next) {
  if (this.fields) {
    this.fields = this.fields.map((field) => ({
      ...field,
      normalizedLabel:
        field.normalizedLabel || field.label.toLowerCase().replace(/\s+/g, '_'),
    }));
  }
  next();
});

module.exports = mongoose.model('EventForm', eventFormSchema);
