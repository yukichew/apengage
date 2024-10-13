const { createForm } = require('../../controllers/event/formController');
const { joinEvent } = require('../../controllers/event/registrationController');
const { authenticate } = require('../../middlewares/auth');
const { isLogoExist } = require('../../middlewares/image');
const multer = require('../../middlewares/multer');
const { eventFormValidator, validate } = require('../../middlewares/validator');

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

router.post('/:id/join', authenticate, validate, joinEvent);

module.exports = router;
