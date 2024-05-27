const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const verificationSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 3600,
  },
});

verificationSchema.pre('save', async function (next) {
  if (this.isModified('token')) {
    const hash = await bcrypt.hash(this.token, 8);
    this.token = hash;
  }
  next();
});

verificationSchema.methods.compareToken = async function (token) {
  return await bcrypt.compare(token, this.token);
};

module.exports = mongoose.model('VerificationToken', verificationSchema);
