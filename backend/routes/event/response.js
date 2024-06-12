const { joinEvent } = require('../../controllers/event/responseController');
const { authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validator');

const router = require('express').Router();

router.post('/:id/join', authenticate, validate, joinEvent);

module.exports = router;
