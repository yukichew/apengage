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

exports.transportBookingValidator = [
  check('transportType')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Transport type is missing'),
  check('departFrom')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Departure location is missing'),
  check('departTo')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Destination location is missing'),
  check('departDate')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Departure date is missing'),
  check('returnDate')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Return date is missing'),
  check('returnTo')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Return location is missing'),
];
