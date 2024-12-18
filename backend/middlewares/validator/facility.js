const { check } = require('express-validator');

exports.facilityValidator = [
  check('name').trim().not().isEmpty().withMessage('Venue name is missing'),
  check('type').trim().not().isEmpty().withMessage('Venue type is missing'),
  check('quantity')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Venue quantity is missing'),
];

exports.facilityBookingValidator = [
  check('facilityId')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Facility id is missing'),
  check('startTime')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Start time is missing'),
  check('endTime').trim().not().isEmpty().withMessage('End time is missing'),
  check('venueBookingId')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Venue booking id is missing'),
];
