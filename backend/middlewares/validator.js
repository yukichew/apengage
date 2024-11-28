const { check, validationResult, body } = require('express-validator');
const { sendError } = require('../helpers/error');

exports.userValidator = [
  check('apkey')
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

exports.eventFormValidator = [
  check('name').trim().not().isEmpty().withMessage('Event name is missing'),
  check('desc')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Event description is missing'),
  check('date').trim().not().isEmpty().withMessage('Event date is missing'),
  check('location')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Event location is missing'),
  check('organizer')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Event organizer is missing'),
  check('categories').not().isEmpty().withMessage('Event category is missing'),
  check('price').trim().not().isEmpty().withMessage('Event price is missing'),
  check('postedBy').trim().not().isEmpty().withMessage('Posted by is missing'),
];

exports.fieldValidator = [
  body('fields').isArray().withMessage('Fields must be an array'),
  body('fields.*.label')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Field label is missing'),
  body('fields.*.required')
    .isBoolean()
    .withMessage('Field required must be a boolean'),
  body('fields.*.desc').optional().trim(),
  body('fields.*.type')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Field type is missing')
    .isIn([
      'short_ans',
      'long_ans',
      'mcq',
      'checkbox',
      'dropdown',
      'date',
      'time',
      'file',
    ])
    .withMessage('Invalid field type'),
  body('fields.*.options')
    .optional()
    .isArray()
    .withMessage('Field options must be an array of strings'),
  body('fields.*.order')
    .optional()
    .isInt()
    .withMessage('Field order must be an integer'),
];

exports.categoryValidator = [
  check('name').trim().not().isEmpty().withMessage('Category name is missing'),
  check('desc')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Category description is missing'),
];

exports.registrationValidator = [];

exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (error.length) {
    return sendError(res, 400, error[0].msg);
  }
  next();
};
