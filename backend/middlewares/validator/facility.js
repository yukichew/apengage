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
  check('startTime')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Event start time is missing')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Event start time cannot be in the past');
      }
      return true;
    }),
  check('endTime')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Event end time is missing')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startTime)) {
        throw new Error('Event end time cannot be earlier than start time');
      }
      return true;
    }),
  check('venueBookingId')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Venue booking id is missing'),
];
