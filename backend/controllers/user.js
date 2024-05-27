const { isValidObjectId } = require('mongoose');
const { sendError } = require('../helpers/error');
const {
  generateTOTP,
  mailTransport,
  generateEmailTemplate,
  plainEmailTemplate,
} = require('../helpers/mail');
const User = require('../models/user');
const VerificationToken = require('../models/verificationToken');

const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  const { fullname, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) sendError(res, 400, 'User already exists');

  const newUser = new User({
    fullname,
    email,
    password,
  });

  const OTP = generateTOTP();
  const verificationTken = new VerificationToken({
    owner: newUser._id,
    token: OTP,
  });

  await verificationTken.save();
  await newUser.save();

  mailTransport().sendMail({
    from: 'apengage@email.com',
    to: newUser.email,
    subject: 'Verify your email',
    html: generateEmailTemplate(OTP),
  });

  res.json({
    user: {
      id: newUser._id,
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

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) return sendError(res, 401, 'Invalid credentials!');

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.json({
    user: { id: user._id, name: user.fullname, email: user.email },
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
  if (user.verified) return sendError(res, 400, 'User is already verified!');

  const token = await VerificationToken.findOne({ owner: user._id });
  if (!token) return sendError(res, 404, 'Token not found!');

  const isMatched = await token.compareToken(otp);
  if (!isMatched) return sendError(res, 400, 'Invalid OTP!');

  user.verified = true;
  await VerificationToken.findByIdAndDelete(token._id);
  await user.save();

  mailTransport().sendMail({
    from: 'apengage@email.com',
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
