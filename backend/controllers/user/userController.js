const { isValidObjectId } = require('mongoose');
const { sendError } = require('../../helpers/error');
const {
  generateTOTP,
  mailTransport,
  generateEmailTemplate,
  plainEmailTemplate,
  generateResetPasswordEmailTemplate,
} = require('../../helpers/mail');
const User = require('../../models/auth/user');
const VerificationToken = require('../../models/auth/token');
const ResetToken = require('../../models/auth/token');
const cloudinary = require('../../config/cloud');

const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  const { apkey, fullname, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) sendError(res, 400, 'User already exists');

  const newUser = new User({
    apkey,
    fullname,
    email,
    password,
  });

  await newUser.save();

  const OTP = generateTOTP();
  const verificationToken = new VerificationToken({
    owner: newUser._id,
    token: OTP,
  });

  mailTransport().sendMail({
    from: process.env.MAILGUN_USER,
    to: newUser.email,
    subject: 'Verify Email',
    html: generateEmailTemplate(
      OTP,
      'Your OTP',
      'Welcome to APEngage. Use the following OTP to complete the procedure to verify your email address. Do not share this code with others.'
    ),
  });

  await verificationToken.save();

  res.json({
    user: {
      id: newUser._id,
      apkey: newUser.apkey,
      name: newUser.fullname,
      email: newUser.email,
    },
  });
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email.trim() || !password.trim())
    return sendError(res, 401, 'Email and password are required');

  const user = await User.findOne({ email }).select('+password');
  if (!user) return sendError(res, 401, 'User not found!');

  if (user.status === 'Pending')
    return sendError(res, 401, 'Your account is not verified yet!');

  if (user.status === 'Inactive')
    return sendError(res, 401, 'Your account has been blocked!');

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) return sendError(res, 401, 'Invalid credentials!');

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );

  res.json({
    user: {
      id: user._id,
      name: user.fullname,
      email: user.email,
      profile: user.profile?.url,
      gender: user.gender,
      course: user.course,
      intake: user.intake,
      apkey: user.apkey,
      role: user.role,
    },
    token,
  });
};

exports.verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp || typeof otp !== 'string' || !otp.trim())
    return sendError(res, 400, 'Invalid request!');
  if (!isValidObjectId(userId)) return sendError(res, 400, 'Invalid user id!');

  const user = await User.findById(userId);
  if (!user) return sendError(res, 404, 'User not found!');
  if (user.status == 'Active')
    return sendError(res, 400, 'User is already verified!');

  const token = await VerificationToken.findOne({ owner: user._id });
  if (!token) return sendError(res, 404, 'Token not found!');

  const isMatched = await token.compareToken(otp);
  if (!isMatched) return sendError(res, 400, 'Invalid OTP!');

  user.status = 'Active';
  await VerificationToken.findByIdAndDelete(token._id);
  await user.save();

  mailTransport().sendMail({
    from: process.env.MAILGUN_USER,
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
    from: process.env.MAILGUN_USER,
    to: user.email,
    subject: 'Reset Password',
    html: generateResetPasswordEmailTemplate(
      `http://192.168.100.111:3000/reset-password?token=${token}&id=${user._id}`,
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

  user.password = password.trim();
  await user.save();

  await ResetToken.findOneAndDelete({ owner: user._id });

  mailTransport().sendMail({
    from: process.env.MAILGUN_USER,
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
  const { fullname, gender, contact, course, intake } = req.body;
  const { file } = req;
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user) sendError(res, 400, 'User not found!');

  user.fullname = fullname;
  user.gender = gender;
  user.contact = contact;
  user.course = course;
  user.intake = intake;

  const public_id = user.profile?.public_id;

  if (file && public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== 'ok')
      return sendError(res, 500, 'Failed to update profile picture');
  }

  if (file) {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file.path
    );
    user.profile = { url, public_id };
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
      contact: user.contact,
    },
  });
};

exports.getProfile = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);
  if (!user) sendError(res, 400, 'User not found!');

  res.json({
    user: {
      id: user._id,
      name: user.fullname,
      email: user.email,
      contact: user.contact,
      profile: user.profile?.url,
      gender: user.gender,
      course: user.course,
      intake: user.intake,
      apkey: user.apkey,
    },
  });
};

exports.changePassword = async (req, res) => {
  const { password } = req.body;

  if (!password) return sendError(res, 400, 'Invalid request');

  const user = await User.findById(req.user._id).select('+password');
  if (!user) return sendError(res, 404, 'User not found!');

  const isSamePassword = await user.comparePassword(password);
  if (isSamePassword)
    return sendError(
      res,
      400,
      'New password must be different from the old one!'
    );

  user.password = password.trim();
  await user.save();

  res.json({
    message: 'Password reset successfully!',
  });
};
