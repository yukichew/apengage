const {
  createForm,
  getForm,
} = require('../../controllers/event/formController');
const { joinEvent } = require('../../controllers/event/registrationController');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validator');
const { fieldValidator } = require('../../middlewares/validator/event');
const router = require('express').Router();

router.post('/create', authenticate, fieldValidator, validate, createForm);
router.post('/:id/join', authenticate, validate, joinEvent);
router.get('/:id', authenticate, validate, getForm);

module.exports = router;
