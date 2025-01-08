const {
  getEvents,
  searchEvents,
  getAllEvents,
  createEvent,
  getEvent,
  getCreatedActiveEvents,
  udpateEventStatus,
  searchCreatedEvents,
  getVenueUtilization,
  searchVenueUtilization,
  updateEvent,
} = require('../../controllers/event/eventController');
const {
  getRegistration,
  getRegistrations,
  markAttendance,
  searchParticipatedEvents,
} = require('../../controllers/event/registrationController');
const { authenticate, isAdmin } = require('../../middlewares/auth');
const { isLogoExist } = require('../../middlewares/image');
const { imageUploader } = require('../../middlewares/multer');
const { validate } = require('../../middlewares/validator');
const { eventFormValidator } = require('../../middlewares/validator/event');
const router = require('express').Router();

router.post(
  '/create',
  authenticate,
  imageUploader.single('thumbnail'),
  isLogoExist,
  eventFormValidator,
  validate,
  createEvent
);
router.put('/status/:id', authenticate, isAdmin, udpateEventStatus);
router.put('/:id', authenticate, updateEvent);
router.post('/mark-attendance', authenticate, markAttendance);
router.get('/events', authenticate, getEvents);
router.get('/search', authenticate, searchEvents);
router.get('/registration/:id', authenticate, getRegistration);
router.get('/registrations/:id', authenticate, getRegistrations);
router.get('/events/organized/search', authenticate, searchCreatedEvents);
router.get('/events/organized/approved', authenticate, getCreatedActiveEvents);
router.get(
  '/events/participated/search',
  authenticate,
  searchParticipatedEvents
);
router.get('/venue-utilization/search', authenticate, searchVenueUtilization);
router.get('/:id', authenticate, getEvent);

module.exports = router;
