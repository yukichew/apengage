const {
  createForm,
  getForm,
} = require('../../controllers/event/formController');
const { joinEvent } = require('../../controllers/event/registrationController');
const { authenticate } = require('../../middlewares/auth');
const { fileUploader } = require('../../middlewares/multer');
const { validate } = require('../../middlewares/validator');
const { fieldValidator } = require('../../middlewares/validator/event');
const router = require('express').Router();

router.post('/create', authenticate, fieldValidator, validate, createForm);
router.post(
  '/:id/join',
  authenticate,
  fileUploader.single('file'),
  validate,
  joinEvent
);
router.get('/:id', authenticate, validate, getForm);

module.exports = router;
