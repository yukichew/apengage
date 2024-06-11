const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const baseOptions = {
  discriminatorKey: 'type',
  collection: 'tokens',
};

const tokenSchema = new mongoose.Schema(
  {
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
  },
  baseOptions
);

tokenSchema.pre('save', async function (next) {
  if (this.isModified('token')) {
    const hash = await bcrypt.hash(this.token, 8);
    this.token = hash;
  }
  next();
});

tokenSchema.methods.compareToken = async function (token) {
  return await bcrypt.compare(token, this.token);
};

const BaseToken = mongoose.model('BaseToken', tokenSchema);

module.exports = BaseToken.discriminator('ResetToken', new mongoose.Schema({}));
module.exports = BaseToken.discriminator(
  'VerificationToken',
  new mongoose.Schema({})
);
