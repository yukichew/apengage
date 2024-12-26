const {
  createFeedback,
} = require('../../controllers/event/feedbackController');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validator');
const { feedbackValidator } = require('../../middlewares/validator/feedback');
const router = require('express').Router();

router.post(
  '/create',
  authenticate,
  feedbackValidator,
  validate,
  createFeedback
);

module.exports = router;