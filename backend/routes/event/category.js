const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategory,
  searchCategory,
} = require('../../controllers/event/categoryController');
const { authenticate } = require('../../middlewares/auth');
const { categoryValidator } = require('../../middlewares/validator');

const router = require('express').Router();

router.post('/create', authenticate, categoryValidator, createCategory);
router.put('/:id', authenticate, categoryValidator, updateCategory);
router.delete('/:id', authenticate, deleteCategory);
router.get('/:id', authenticate, getCategory);
router.get('/categories', authenticate, getCategories);
router.get('/search', authenticate, searchCategory);

module.exports = router;
