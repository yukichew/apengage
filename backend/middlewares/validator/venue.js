const { check } = require('express-validator');

exports.venueValidator = [
  check('name').trim().not().isEmpty().withMessage('Venue name is missing'),
  check('type').trim().not().isEmpty().withMessage('Venue type is missing'),
  check('capacity')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Venue capacity is missing'),
];

exports.venueBookingValidator = [
  check('venueId').trim().not().isEmpty().withMessage('Venue id is missing'),
  check('date').trim().not().isEmpty().withMessage('Date is missing'),
  check('startTime')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Start time is missing'),
  check('endTime').trim().not().isEmpty().withMessage('End time is missing'),
  check('purpose').trim().not().isEmpty().withMessage('Purpose is missing'),
];
