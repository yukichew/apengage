const { authenticate } = require('../middlewares/auth');

const router = require('express').Router();

router.post('/create', authenticate);

module.exports = router;
