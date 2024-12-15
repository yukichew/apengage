const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    apkey: {
      type: String,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    profile: {
      type: Object,
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    gender: {
      type: String,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    course: {
      type: String,
      trim: true,
    },
    intake: {
      type: String,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hash = await bcrypt.hash(this.password, 8);
    this.password = hash;
  }
  next();
});

// compare hashed password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
