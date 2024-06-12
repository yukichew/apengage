const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategory,
  searchCategory,
} = require('../../controllers/event/categoryController');
const { authenticate } = require('../../middlewares/auth');
const { categoryValidator, validate } = require('../../middlewares/validator');

const router = require('express').Router();

router.post(
  '/create',
  authenticate,
  categoryValidator,
  validate,
  createCategory
);
router.put('/:id', authenticate, categoryValidator, validate, updateCategory);
router.delete('/:id', authenticate, deleteCategory);
router.get('/categories', authenticate, getCategories);
router.get('/search', authenticate, searchCategory);
router.get('/:id', authenticate, getCategory);

module.exports = router;
