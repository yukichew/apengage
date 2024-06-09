const router = require('express').Router();
const {
  createUser,
  signin,
  verifyEmail,
  forgetPassword,
  resetPassword,
} = require('../controllers/userController');
const multer = require('../middlewares/multer');
const { isResetTokenValid, authenticate } = require('../middlewares/auth');
const { userValidator, validate } = require('../middlewares/validator');

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

module.exports = router;
