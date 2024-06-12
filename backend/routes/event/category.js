const {
  createCategory,
} = require('../../controllers/event/categoryController');
const { authenticate } = require('../../middlewares/auth');
const { categoryValidator } = require('../../middlewares/validator');

const router = require('express').Router();

router.post('/create', authenticate, categoryValidator, createCategory);

module.exports = router;
