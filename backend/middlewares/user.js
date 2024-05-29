const { isValidObjectId } = require('mongoose');
const { sendError } = require('../helpers/error');
const User = require('../models/user');
const ResetToken = require('../models/resetToken');

exports.isResetTokenValid = async (req, res, next) => {
  const { token, id } = req.query;
  if (!token || typeof token !== 'string' || !token.trim() || !id)
    return sendError(res, 400, 'Invalid request');

  if (!isValidObjectId(id)) return sendError(res, 400, 'Invalid user!');

  const user = await User.findById(id);
  if (!user) return sendError(res, 404, 'User not found!');

  const resetToken = await ResetToken.findOne({ owner: user._id });
  if (!resetToken) return sendError(res, 404, 'Reset token not found!');

  const isMatched = await resetToken.compareToken(token);
  if (!isMatched) return sendError(res, 400, 'Invalid reset token!');

  req.user = user;
  next();
};
