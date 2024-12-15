const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategory,
  searchCategory,
} = require('../../controllers/event/categoryController');
const { authenticate, isAdmin } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validator');
const { categoryValidator } = require('../../middlewares/validator/event');

const router = require('express').Router();

router.post(
  '/create',
  authenticate,
  isAdmin,
  categoryValidator,
  validate,
  createCategory
);
router.put(
  '/:id',
  authenticate,
  isAdmin,
  categoryValidator,
  validate,
  updateCategory
);
router.delete('/:id', authenticate, isAdmin, deleteCategory);
router.get('/categories', authenticate, getCategories);
router.get('/search', authenticate, searchCategory);
router.get('/:id', authenticate, getCategory);

module.exports = router;
