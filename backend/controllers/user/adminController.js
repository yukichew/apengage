const { isValidObjectId } = require('mongoose');
const { sendError } = require('../../helpers/error');
const User = require('../../models/auth/user');
const { mailTransport, plainEmailTemplate } = require('../../helpers/mail');

exports.createAdmin = async (req, res) => {
  const { email, fullname } = req.body;

  const user = await User.findOne({
    email,
  });
  if (user) return sendError(res, 400, 'User already exists');

  const newAdmin = new User({
    email,
    fullname,
    password: process.env.DEFAULT_PASSWORD,
    role: 'admin',
    verified: true,
  });

  await newAdmin.save();

  mailTransport().sendMail({
    from: process.env.MAILTRAP_TESTEMAIL,
    to: newAdmin.email,
    subject: 'Admin Account Created',
    html: plainEmailTemplate(
      'Your account has been created',
      'Welcome to APEngage. Your admin account has been created. You can now login to your account using the default password provided below. Please change your password after logging in. \n\n Default Password: ' +
        process.env.DEFAULT_PASSWORD +
        '\n\n'
    ),
  });

  res.json({
    user: {
      id: newAdmin._id,
      email: newAdmin.email,
      fullname: newAdmin.fullname,
      status: newAdmin.verified ? 'Active' : 'Inactive',
    },
  });
};

exports.updateAdmin = async (req, res) => {
  const { fullname } = req.body;
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid user id');

  const user = await User.findById(id);
  if (!user) return sendError(res, 404, 'Admin not found');

  user.fullname = fullname;

  await user.save();

  res.json({
    user: {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      status: user.verified ? 'Active' : 'Inactive',
    },
  });
};

exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid user id');

  const user = await User.findById(id);
  if (!user) return sendError(res, 404, 'User not found');

  if (action === 'activate') {
    user.verified = true;
    await user.save();
    return res.json({ message: 'User activated' });
  }

  if (action === 'deactivate') {
    user.verified = false;
    await user.save();
    return res.json({ message: 'User deactivated' });
  }

  res.status(400).json({ message: 'Invalid action' });
};

exports.getUsers = async (req, res) => {
  const { role } = req.query;
  const query = {};
  if (role) query.role = role;

  const users = await User.find(query).sort({ createdAt: -1 });
  const count = await User.countDocuments(query);

  res.json({
    users: users.map((user) => {
      return {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        apkey: user?.apkey,
        contact: user?.contact,
        gender: user?.gender,
        course: user?.course,
        intake: user?.intake,
        profile: user.profile?.url,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        status: user.verified ? 'Active' : 'Inactive',
      };
    }),
    count,
  });
};

exports.getUser = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) return sendError(res, 401, 'Invalid user id');

  const user = await User.findById(id);
  if (!user) return sendError(res, 404, 'user not found');

  res.json({
    user: {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      apkey: user?.apkey,
      contact: user?.contact,
      gender: user?.gender,
      course: user?.course,
      intake: user?.intake,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      status: user.verified ? 'Active' : 'Inactive',
    },
  });
};

exports.searchUser = async (req, res) => {
  const { fullname, role } = req.query;

  const query = {};
  if (role) query.role = role;
  if (fullname) query.fullname = { $regex: fullname, $options: 'i' };

  const result = await User.find(query);

  res.json({
    users: result.map((user) => {
      return {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        apkey: user?.apkey,
        contact: user?.contact,
        gender: user?.gender,
        course: user?.course,
        intake: user?.intake,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        status: user.verified ? 'Active' : 'Inactive',
      };
    }),
  });
};
