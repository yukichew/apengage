const { isValidObjectId } = require('mongoose');
const { sendError } = require('../helpers/error');
const {
  generateTOTP,
  mailTransport,
  generateEmailTemplate,
  plainEmailTemplate,
  generateResetPasswordEmailTemplate,
} = require('../helpers/mail');
const User = require('../models/auth/user');
const VerificationToken = require('../models/auth/token');
const ResetToken = require('../models/auth/token');
const cloudinary = require('../config/cloud');

const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  const {
    apkey,
    fullname,
    email,
    password,
    gender,
    contact,
    course,
    intake,
    nric,
  } = req.body;
  const { file } = req;

  const user = await User.findOne({ email });
  if (user) sendError(res, 400, 'User already exists');

  const newUser = new User({
    apkey,
    fullname,
    email,
    password,
    gender,
    contact,
    course,
    intake,
    nric,
  });

  if (file) {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file.path
    );
    newUser.profile = { url, public_id };
  }

  const OTP = generateTOTP();
  const verificationToken = new VerificationToken({
    owner: newUser._id,
    token: OTP,
  });

  await verificationToken.save();
  await newUser.save();

  mailTransport().sendMail({
    from: process.env.MAILTRAP_TESTEMAIL,
    to: newUser.email,
    subject: 'Verify Email',
    html: generateEmailTemplate(
      OTP,
      'Your OTP',
      'Welcome to APEngage. Use the following OTP to complete the procedure to verify your email address. Do not share this code with others.'
    ),
  });

  res.json({
    user: {
      id: newUser._id,
      apkey: newUser.apkey,
      name: newUser.fullname,
      email: newUser.email,
      profile: newUser.profile?.url,
      gender: newUser.gender,
      course: newUser.course,
      intake: newUser.intake,
      nric: newUser.nric,
    },
  });
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email.trim() || !password.trim())
      return sendError(res, 401, 'Email and password are required');

    const user = await User.findOne({ email }).select('+password');
    if (!user) return sendError(res, 401, 'User not found!');

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) return sendError(res, 401, 'Invalid credentials!');

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      user: { id: user._id, name: user.fullname, email: user.email },
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp || typeof otp !== 'string' || !otp.trim())
    return sendError(res, 400, 'Invalid request!');
  if (!isValidObjectId(userId)) return sendError(res, 400, 'Invalid user id!');

  const user = await User.findById(userId);
  if (!user) return sendError(res, 404, 'User not found!');
  if (user.verified) return sendError(res, 400, 'User is already verified!');

  const token = await VerificationToken.findOne({ owner: user._id });
  if (!token) return sendError(res, 404, 'Token not found!');

  const isMatched = await token.compareToken(otp);
  if (!isMatched) return sendError(res, 400, 'Invalid OTP!');

  user.verified = true;
  await VerificationToken.findByIdAndDelete(token._id);
  await user.save();

  mailTransport().sendMail({
    from: process.env.MAILTRAP_TESTEMAIL,
    to: user.email,
    subject: 'Welcome Message',
    html: plainEmailTemplate(
      'Email verified successfully!',
      'You can now login to your account.'
    ),
  });

  res.json({
    message: 'Email verified successfully!',
    user: { id: user._id, name: user.fullname, email: user.email },
  });
};

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email.trim()) return sendError(res, 400, 'Email is required!');

  const user = await User.findOne({ email });
  if (!user) return sendError(res, 404, 'User not found!');

  const token = await ResetToken.findOne({ owner: user._id });
  if (token)
    return sendError(
      res,
      404,
      'You can only request for another token after 1 hour!'
    );

  const OTP = generateTOTP();
  const resetToken = new ResetToken({
    owner: user._id,
    token: OTP,
  });

  await resetToken.save();

  mailTransport().sendMail({
    from: process.env.MAILTRAP_TESTEMAIL,
    to: user.email,
    subject: 'Reset Password',
    html: generateResetPasswordEmailTemplate(
      `http://localhost:3000/reset-password`,
      'Click the link to reset your password'
    ),
  });

  res.json({
    message: 'Password reset link sent to your email!',
    token: OTP,
  });
};

exports.resetPassword = async (req, res) => {
  const { token, id, password } = req.body;

  if (!token || !id || !password) return sendError(res, 400, 'Invalid request');

  const user = await User.findById(req.user._id).select('+password');
  if (!user) return sendError(res, 404, 'User not found!');

  const isSamePassword = await user.comparePassword(password);
  if (isSamePassword)
    return sendError(
      res,
      400,
      'New password must be different from the old one!'
    );

  if (password.trim().length < 8)
    return sendError(res, 400, 'Password must be at least 8 characters long!');

  user.password = password.trim();
  await user.save();

  await ResetToken.findOneAndDelete({ owner: user._id });

  mailTransport().sendMail({
    from: process.env.MAILTRAP_TESTEMAIL,
    to: user.email,
    subject: 'Reset Password Successful Message',
    html: plainEmailTemplate(
      'Password reset successfully!',
      'You can now login to your account with your new password.'
    ),
  });

  res.json({
    message: 'Password reset successfully!',
  });
};

exports.editProfile = async (req, res) => {
  const { fullname, gender, contact, course, intake, nric } = req.body;
  const { file } = req;
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid category id');

  const user = await User.findById(id);
  if (!user) sendError(res, 400, 'User not found!');

  user.fullname = fullname;
  user.gender = gender;
  user.contact = contact;
  user.course = course;
  user.intake = intake;
  user.nric = nric;

  const public_id = user.profile?.public_id;

  if (file && public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== 'ok')
      return sendError(res, 500, 'Failed to update profile picture');

    if (file) {
      const { secure_url: url, public_id } = await cloudinary.uploader.upload(
        file.path
      );
      user.profile = { url, public_id };
    }
  }

  await user.save();

  res.json({
    user: {
      id: user._id,
      name: user.fullname,
      profile: user.profile?.url,
      gender: user.gender,
      course: user.course,
      intake: user.intake,
      nric: user.nric,
    },
  });
};
