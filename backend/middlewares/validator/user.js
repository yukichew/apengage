const { check, body } = require('express-validator');

exports.userValidator = [
  check('apkey')
    .if(body('role').equals('student'))
    .trim()
    .not()
    .isEmpty()
    .withMessage('APKey is missing')
    .matches(/^tp\d{6}$/i)
    .withMessage('APKey must be in the format TPXXXXXX'),
  check('fullname')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name is missing')
    .isLength({ min: 3, max: 20 })
    .withMessage('Name must be between 3 and 20 characters'),
  check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Email is invalid')
    .custom((value, { req }) => {
      const emailRegex = /^([a-zA-Z0-9._%+-]+)@mail\.apu\.edu\.my$/;
      if (!emailRegex.test(value)) {
        throw new Error('Should only be an APU email address');
      }
      const apkey = req.body.apkey;
      const apkeyInEmail = value.split('@')[0];
      if (apkey.toLowerCase() !== apkeyInEmail.toLowerCase()) {
        throw new Error('APKey must match the email prefix');
      }
      return true;
    }),
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is missing')
    .matches(/^(?=.*[A-Z])(?=.*[\W_])(?=.*\d)[a-zA-Z\d\W_]{8,}$/)
    .withMessage(
      'Password must be at least 8 characters long, contain at least 1 uppercase letter, and 1 special character'
    ),
];

exports.adminValidator = [
  check('fullname')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name is missing')
    .isLength({ min: 3, max: 20 })
    .withMessage('Name must be between 3 and 20 characters'),
  check('email').normalizeEmail().isEmail().withMessage('Email is invalid'),
];

exports.resetPasswordValidator = [
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is missing')
    .matches(/^(?=.*[A-Z])(?=.*[\W_])(?=.*\d)[a-zA-Z\d\W_]{8,}$/)
    .withMessage(
      'Password must be at least 8 characters long, contain at least 1 uppercase letter, and 1 special character'
    ),
];
