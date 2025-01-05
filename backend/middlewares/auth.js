const { isValidObjectId } = require('mongoose');
const { sendError } = require('../helpers/error');
const User = require('../models/auth/user');
const ResetToken = require('../models/auth/token');
const jwt = require('jsonwebtoken');

exports.isResetTokenValid = async (req, res, next) => {
  const { token, id } = req.body;
  if (!token || typeof token !== 'string' || !token.trim() || !id)
    return sendError(res, 400, 'Invalid request');

  if (!isValidObjectId(id)) return sendError(res, 400, 'Invalid user!');

  const user = await User.findById(id);
  if (!user) return sendError(res, 404, 'User not found!');

  const resetToken = await ResetToken.findOne({ owner: user._id });
  if (!resetToken) return sendError(res, 404, 'Reset token not found!');

  req.user = user;
  next();
};

exports.authenticate = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return sendError(res, 401, 'Unauthorized!');
  const token = authHeader.split(' ')[1];
  if (!token) return sendError(res, 401, 'Unauthorized!');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return sendError(res, 401, 'Invalid token!');

    const user = await User.findById(decoded.userId);
    if (!user) return sendError(res, 404, 'User not found!');

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token expired!');
    }
    return sendError(res, 401, 'Invalid token!');
  }
};

exports.isAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return sendError(res, 403, 'Access denied. Admins only.');
  }
  next();
};
