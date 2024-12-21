const { check, body } = require('express-validator');

exports.eventFormValidator = [
  check('name').trim().not().isEmpty().withMessage('Event name is missing'),
  check('desc')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Event description is missing'),
  check('startTime')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Event start time is missing'),
  check('endTime')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Event end time is missing'),
  check('mode')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Event mode is missing')
    .isIn(['online', 'oncampus', 'offcampus'])
    .withMessage('Event mode must be online, oncampus, or offcampus'),
  check('location')
    .if(
      body('mode').custom(
        (value) => value === 'offcampus' || value === 'online'
      )
    )
    .trim()
    .not()
    .isEmpty()
    .withMessage((value, { req }) => {
      if (req.body.mode === 'online') {
        return 'Event platform is required for online events';
      }
      return 'Event location is required for off-campus events';
    }),
  check('venueBooking')
    .if(body('mode').equals('oncampus'))
    .if(body('type').not().equals('public'))
    .trim()
    .not()
    .isEmpty()
    .withMessage('Venue booking is required for physical on-campus events'),
  check('categories')
    .if(body('type').equals('public'))
    .not()
    .isEmpty()
    .withMessage('Event category is missing'),
  check('price')
    .if(body('type').equals('public'))
    .trim()
    .not()
    .isEmpty()
    .withMessage('Event price is required for public events'),
  check('organizer')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Event organizer is missing'),
];

exports.fieldValidator = [
  body('fields').isArray().withMessage('Fields must be an array'),
  body('fields.*.label')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Field label is missing'),
  body('fields.*.required')
    .isBoolean()
    .withMessage('Field required must be a boolean'),
  body('fields.*.desc').optional().trim(),
  body('fields.*.type')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Field type is missing')
    .isIn([
      'short_ans',
      'long_ans',
      'mcq',
      'checkbox',
      'dropdown',
      'date',
      'time',
      'file',
    ])
    .withMessage('Invalid field type'),
  body('fields.*.options')
    .optional()
    .isArray()
    .withMessage('Field options must be an array of strings'),
  body('fields.*.order')
    .optional()
    .isInt()
    .withMessage('Field order must be an integer'),
];

exports.categoryValidator = [
  check('name').trim().not().isEmpty().withMessage('Category name is missing'),
  check('desc')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Category description is missing'),
];
