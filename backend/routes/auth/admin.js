const {
  getUsers,
  searchUser,
  getUser,
  updateAdmin,
  createAdmin,
  updateUserStatus,
} = require('../../controllers/user/adminController');
const { isAdmin, authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validator');
const { adminValidator } = require('../../middlewares/validator/user');

const router = require('express').Router();

router.post(
  '/create',
  authenticate,
  isAdmin,
  adminValidator,
  validate,
  createAdmin
);
router.put('/:id', authenticate, isAdmin, updateAdmin);
router.put('/status/:id', authenticate, isAdmin, updateUserStatus);
router.get('/users', authenticate, isAdmin, getUsers);
router.get('/search', authenticate, isAdmin, searchUser);
router.get('/:id', authenticate, isAdmin, getUser);

module.exports = router;
