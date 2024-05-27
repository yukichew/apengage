const router = require('express').Router();
const { createUser, signin, verifyEmail } = require('../controllers/user');
const { userValidator, validate } = require('../middlewares/validator');

router.post('/create', userValidator, validate, createUser);
router.post('/signin', signin);
router.post('/verify-email', verifyEmail);

module.exports = router;
