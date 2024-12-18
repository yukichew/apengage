const router = require('express').Router();
const {
  createUser,
  signin,
  verifyEmail,
  forgetPassword,
  resetPassword,
  editProfile,
  getProfile,
} = require('../controllers/user/userController');
const multer = require('../middlewares/multer');
const { isResetTokenValid, authenticate } = require('../middlewares/auth');
const { validate } = require('../middlewares/validator');
const { userValidator } = require('../middlewares/validator/user');

// Auth Routes
router.post(
  '/create',
  multer.single('profile'),
  userValidator,
  validate,
  createUser
);
router.post('/signin', signin);
router.post('/verify-email', verifyEmail);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', isResetTokenValid, resetPassword);

// Profile Routes
router.patch('/change-password', authenticate);
router.put(
  '/edit-profile',
  authenticate,
  multer.single('profile'),
  editProfile
);
router.delete('/delete-account');
router.get('/profile', authenticate, getProfile);

module.exports = router;
