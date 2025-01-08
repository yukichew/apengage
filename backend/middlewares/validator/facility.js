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
  check('quantity')
    .not()
    .isEmpty()
    .withMessage('Facility quantity is missing')
    .isInt({ gt: 0 })
    .withMessage('Facility quantity must be a positive number'),
  check('venueBookingId')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Venue booking id is missing'),
];
