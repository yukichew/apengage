const { check, validationResult } = require('express-validator');

exports.userValidator = [
  check('fullname')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name is missing')
    .isLength({ min: 3, max: 20 })
    .withMessage('Name must be between 3 and 20 characters'),
  check('email').normalizeEmail().isEmail().withMessage('Email is invalid'),
  check('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password is missing')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

exports.validate = (req, res, next) => {
  const error = validationResult(req).array();
  if (error.length) {
    return res.status(401).json({ error: error[0].msg });
  }
  next();
};
