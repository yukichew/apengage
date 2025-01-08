const { getDashboardData } = require('../controllers/dashboard');
const { authenticate } = require('../middlewares/auth');

const router = require('express').Router();

router.get('/', authenticate, getDashboardData);

module.exports = router;
