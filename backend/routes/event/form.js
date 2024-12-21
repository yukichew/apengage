const { createForm } = require('../../controllers/event/formController');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validator');
const { fieldValidator } = require('../../middlewares/validator/event');
const router = require('express').Router();

router.post('/create', authenticate, fieldValidator, validate, createForm);

module.exports = router;
