const {
  getEvents,
  searchEvents,
  getAllEvents,
} = require('../../controllers/event/eventController');
const {
  createForm,
  addFields,
} = require('../../controllers/event/formController');
const { joinEvent } = require('../../controllers/event/registrationController');
const { authenticate, isAdmin } = require('../../middlewares/auth');
const { isLogoExist } = require('../../middlewares/image');
const multer = require('../../middlewares/multer');
const { validate } = require('../../middlewares/validator');
const {
  eventFormValidator,
  fieldValidator,
} = require('../../middlewares/validator/event');

const router = require('express').Router();

router.post(
  '/create',
  authenticate,
  multer.single('thumbnail'),
  isLogoExist,
  eventFormValidator,
  validate,
  createForm
);

router.put(
  '/:id/add-fields',
  authenticate,
  fieldValidator,
  validate,
  addFields
);

router.post('/:id/join', authenticate, validate, joinEvent);

router.get('/events', authenticate, getEvents);
router.get('/allEvents', authenticate, isAdmin, getAllEvents);
router.get('/search', authenticate, searchEvents);

module.exports = router;
