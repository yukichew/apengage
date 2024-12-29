const {
  getEvents,
  searchEvents,
  getAllEvents,
  createEvent,
  getEvent,
  getCreatedEvents,
  getCreatedActiveEvents,
} = require('../../controllers/event/eventController');
const {
  getRegistration,
  getParticipatedEvents,
  getRegistrations,
  markAttendance,
} = require('../../controllers/event/registrationController');
const { authenticate, isAdmin } = require('../../middlewares/auth');
const { isLogoExist } = require('../../middlewares/image');
const multer = require('../../middlewares/multer');
const { validate } = require('../../middlewares/validator');
const { eventFormValidator } = require('../../middlewares/validator/event');
const router = require('express').Router();

router.post(
  '/create',
  authenticate,
  multer.single('thumbnail'),
  isLogoExist,
  eventFormValidator,
  validate,
  createEvent
);
router.post('/mark-attendance', authenticate, markAttendance);
router.get('/events', authenticate, getEvents);
router.get('/allEvents', authenticate, isAdmin, getAllEvents);
router.get('/search', authenticate, searchEvents);
router.get('/registration/:id', authenticate, getRegistration);
router.get('/registrations/:id', authenticate, getRegistrations);
router.get('/events/organized', authenticate, getCreatedEvents);
router.get('/events/organized/approved', authenticate, getCreatedActiveEvents);
router.get('/events/participated', authenticate, getParticipatedEvents);
router.get('/:id', authenticate, getEvent);

module.exports = router;
