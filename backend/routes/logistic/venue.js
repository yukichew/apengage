const {
  createVenue,
  updateVenue,
  deleteVenue,
  getVenues,
  getVenue,
  searchVenue,
} = require('../../controllers/logistic/venueController');
const { authenticate, isAdmin } = require('../../middlewares/auth');
const { venueValidator, validate } = require('../../middlewares/validator');

const router = require('express').Router();

router.post(
  '/create',
  authenticate,
  isAdmin,
  venueValidator,
  validate,
  createVenue
);
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
