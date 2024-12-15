const {
  createVenue,
  updateVenue,
  deleteVenue,
  getVenues,
  getVenue,
  searchVenue,
  bookVenue,
} = require('../../controllers/logistic/venueController');
const { authenticate, isAdmin } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validator');
const { venueValidator } = require('../../middlewares/validator/venue');

const router = require('express').Router();

router.post(
  '/create',
  authenticate,
  isAdmin,
  venueValidator,
  validate,
  createVenue
);
router.post('/book', authenticate, validate, bookVenue);
router.put(
  '/:id',
  authenticate,
  isAdmin,
  venueValidator,
  validate,
  updateVenue
);
router.delete('/:id', authenticate, isAdmin, deleteVenue);
router.get('/venues', authenticate, getVenues);
router.get('/search', authenticate, searchVenue);
router.get('/:id', authenticate, getVenue);

module.exports = router;
