const {
  createVenue,
  updateVenue,
  deleteVenue,
  getVenues,
  getVenue,
  searchVenue,
  bookVenue,
  getVenueBookings,
  udpateVenueBookingStatus,
  searchVenueBookings,
  getAvailableVenueBookings,
  updateVenueStatus,
} = require('../../controllers/logistic/venueController');
const { authenticate, isAdmin } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validator');
const {
  venueValidator,
  venueBookingValidator,
} = require('../../middlewares/validator/venue');

const router = require('express').Router();

router.post(
  '/create',
  authenticate,
  isAdmin,
  venueValidator,
  validate,
  createVenue
);
router.post('/book', authenticate, venueBookingValidator, validate, bookVenue);
router.put(
  '/:id',
  authenticate,
  isAdmin,
  venueValidator,
  validate,
  updateVenue
);
router.put('/status/:id', authenticate, isAdmin, updateVenueStatus);
router.put(
  '/booking/status/:id',
  authenticate,
  isAdmin,
  udpateVenueBookingStatus
);
router.delete('/:id', authenticate, isAdmin, deleteVenue);
router.get('/venues', authenticate, getVenues);
router.get('/search', authenticate, isAdmin, searchVenue);
router.get('/bookings', authenticate, getVenueBookings);
router.get('/bookings/available', authenticate, getAvailableVenueBookings);
router.get('/bookings/search', authenticate, searchVenueBookings);
router.get('/:id', authenticate, getVenue);

module.exports = router;
