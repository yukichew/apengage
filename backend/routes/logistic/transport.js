const {
  createTransport,
  updateTransport,
  getTransportation,
  deleteTransport,
  searchTransport,
  getTransport,
  bookTransport,
  updateTransportBookingStatus,
  getTransportBookings,
  searchTransportBookings,
  updateTransportStatus,
} = require('../../controllers/logistic/transportController');
const { authenticate, isAdmin } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validator');
const {
  transportValidator,
  transportBookingValidator,
} = require('../../middlewares/validator/transport');

const router = require('express').Router();

router.post(
  '/create',
  authenticate,
  isAdmin,
  transportValidator,
  validate,
  createTransport
);
router.post(
  '/book',
  authenticate,
  transportBookingValidator,
  validate,
  bookTransport
);
router.put(
  '/:id',
  authenticate,
  isAdmin,
  transportValidator,
  validate,
  updateTransport
);
router.put('/status/:id', authenticate, isAdmin, updateTransportStatus);
router.put(
  '/booking/status/:id',
  authenticate,
  isAdmin,
  updateTransportBookingStatus
);
router.delete('/:id', authenticate, isAdmin, deleteTransport);
router.get('/transportation', authenticate, getTransportation);
router.get('/search', authenticate, isAdmin, searchTransport);
router.get('/bookings', authenticate, getTransportBookings);
router.get('/bookings/search', authenticate, searchTransportBookings);
router.get('/:id', authenticate, getTransport);

module.exports = router;
