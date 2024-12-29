const router = require('express').Router();
const {
  createUser,
  signin,
  verifyEmail,
  forgetPassword,
  resetPassword,
  editProfile,
  getProfile,
  changePassword,
} = require('../../controllers/user/userController');
const multer = require('../../middlewares/multer');
const { isResetTokenValid, authenticate } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validator');
const {
  userValidator,
  resetPasswordValidator,
  signInValidator,
} = require('../../middlewares/validator/user');

// Auth Routes
router.post(
  '/create',
  multer.single('profile'),
  userValidator,
  validate,
  createUser
);
router.post('/signin', signInValidator, validate, signin);
router.post('/verify-email', verifyEmail);
router.post('/forget-password', forgetPassword);
router.post(
  '/reset-password',
  isResetTokenValid,
  resetPasswordValidator,
  validate,
  resetPassword
);

// Profile Routes
router.put('/change-password', authenticate, changePassword);
router.put(
  '/edit-profile',
  authenticate,
  multer.single('profile'),
  editProfile
);
// router.put('/update-fcm-token', authenticate, updateFCMToken);
router.delete('/delete-account');
router.get('/profile', authenticate, getProfile);

module.exports = router;
