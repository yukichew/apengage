const { check } = require('express-validator');

exports.transportValidator = [
  check('name').trim().not().isEmpty().withMessage('Transport name is missing'),
  check('type').trim().not().isEmpty().withMessage('Transport type is missing'),
  check('capacity')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Transport capacity is missing'),
];
