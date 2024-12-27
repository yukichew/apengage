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
  check('startTime')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Start time is missing')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Atart time cannot be in the past');
      }
      return true;
    }),
  check('endTime')
    .trim()
    .not()
    .isEmpty()
    .withMessage('End time is missing')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startTime)) {
        throw new Error('End time cannot be earlier than start time');
      }
      return true;
    }),
  check('purpose').trim().not().isEmpty().withMessage('Purpose is missing'),
];
