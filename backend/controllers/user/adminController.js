const { isValidObjectId } = require('mongoose');
const { sendError } = require('../../helpers/error');
const User = require('../../models/auth/user');
const { mailTransport, plainEmailTemplate } = require('../../helpers/mail');
const Registration = require('../../models/event/registration');

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
    status: 'Active',
  });

  await newAdmin.save();

  mailTransport().sendMail({
    from: process.env.MAILGUN_USER,
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
      status: newAdmin.status,
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
      status: user.status,
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
    user.status = 'Active';
    await user.save();
    return res.json({ message: 'User activated' });
  }

  if (action === 'deactivate') {
    user.status = 'Inactive';
    await user.save();

    mailTransport().sendMail({
      from: process.env.MAILGUN_USER,
      to: user.email,
      subject: 'Welcome Message',
      html: plainEmailTemplate(
        'Account Deactivated',
        'Your account has been deactivated. Please contact the admin for more information.'
      ),
    });

    return res.json({ message: 'User deactivated' });
  }

  res.status(400).json({ message: 'Invalid action' });
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
      status: user.status,
    },
  });
};

exports.searchUser = async (req, res) => {
  const { fullname, role } = req.query;

  const query = {};
  if (role) query.role = role;
  if (fullname) query.fullname = { $regex: fullname, $options: 'i' };
  query._id = { $ne: req.user._id };

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
        status: user.status,
      };
    }),
    count: result.length,
  });
};

exports.searchAbsentUsers = async (req, res) => {
  const { name } = req.query;

  const matchStage = {
    $match: {
      status: 'Absent',
    },
  };

  const groupStage = {
    $group: {
      _id: '$participant',
      absentCount: { $sum: 1 },
    },
  };

  const secondMatchStage = {
    $match: {
      absentCount: { $gt: 3 },
    },
  };

  const lookupStage = {
    $lookup: {
      from: 'users',
      localField: '_id',
      foreignField: '_id',
      as: 'userDetails',
    },
  };

  const unwindStage = {
    $unwind: '$userDetails',
  };

  const projectStage = {
    $project: {
      id: '$userDetails._id',
      fullname: '$userDetails.fullname',
      email: '$userDetails.email',
      apkey: '$userDetails.apkey',
      contact: '$userDetails.contact',
      gender: '$userDetails.gender',
      course: '$userDetails.course',
      intake: '$userDetails.intake',
      profile: '$userDetails.profile.url',
      createdAt: '$userDetails.createdAt',
      updatedAt: '$userDetails.updatedAt',
      status: '$userDetails.status',
      absentCount: 1,
    },
  };

  const pipeline = [
    matchStage,
    groupStage,
    secondMatchStage,
    lookupStage,
    unwindStage,
    projectStage,
  ];

  if (name) {
    pipeline.push({
      $match: {
        fullname: { $regex: name, $options: 'i' },
      },
    });
  }

  const absentUsers = await Registration.aggregate(pipeline);

  res.json({
    users: absentUsers,
    count: absentUsers.length,
  });
};
