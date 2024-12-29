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
    .optional()
    .trim()
    .custom((value, { req }) => {
      if (value && new Date(value) <= new Date(req.body.departDate)) {
        throw new Error('Return date must be after departure date');
      }
      return true;
    }),
  check('returnTo')
    .optional()
    .trim()
    .custom((value, { req }) => {
      if (req.body.returnDate && !value) {
        throw new Error(
          'Return destination is required if return date is provided'
        );
      }
      return true;
    }),
];
