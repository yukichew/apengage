const {
  createTransport,
  updateTransport,
  getTransportation,
  deleteTransport,
  searchTransport,
  getTransport,
} = require('../../controllers/logistic/transportController');
const { authenticate, isAdmin } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validator');
const { transportValidator } = require('../../middlewares/validator/transport');

const router = require('express').Router();

router.post(
  '/create',
  authenticate,
  isAdmin,
  transportValidator,
  validate,
  createTransport
);
router.put(
  '/:id',
  authenticate,
  isAdmin,
  transportValidator,
  validate,
  updateTransport
);
router.delete('/:id', authenticate, isAdmin, deleteTransport);
router.get('/transportation', authenticate, getTransportation);
router.get('/search', authenticate, searchTransport);
router.get('/:id', authenticate, getTransport);

module.exports = router;
