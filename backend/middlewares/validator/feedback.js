const { check } = require('express-validator');

exports.feedbackValidator = [
  check('registration')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Registration id is missing'),
  check('rating').trim().not().isEmpty().withMessage('Rating is missing'),
  check('comment').trim().not().isEmpty().withMessage('Comment is missing'),
];
