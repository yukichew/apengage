const {
  createFacility,
  bookFacility,
  updateFacility,
  udpateFacilityBookingStatus,
  getFacilities,
  deleteFacility,
  searchFacility,
  getFacilityBookings,
  getFacility,
  getFacilityBookingHistory,
  searchFacilityBookings,
} = require('../../controllers/logistic/facilityController');
const { authenticate, isAdmin } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validator');
const {
  facilityValidator,
  facilityBookingValidator,
} = require('../../middlewares/validator/facility');

const router = require('express').Router();

router.post(
  '/create',
  authenticate,
  isAdmin,
  facilityValidator,
  validate,
  createFacility
);
router.post(
  '/book',
  authenticate,
  facilityBookingValidator,
  validate,
  bookFacility
);
router.put(
  '/:id',
  authenticate,
  isAdmin,
  facilityValidator,
  validate,
  updateFacility
);
router.put(
  '/booking/status/:id',
  authenticate,
  isAdmin,
  udpateFacilityBookingStatus
);
router.delete('/:id', authenticate, isAdmin, deleteFacility);
router.get('/facilities', authenticate, getFacilities);
router.get('/search', authenticate, searchFacility);
router.get('/bookings', authenticate, getFacilityBookings);
router.get('/bookings/search', authenticate, searchFacilityBookings);
router.get('/:id', authenticate, getFacility);

module.exports = router;
