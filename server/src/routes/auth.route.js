import { Router } from 'express';
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
  oauthLogin,
  verifyRegistrationOtp,
  resendRegistrationOtp,
} from '../controllers/auth.controller.js';
import authenticate from '../middlewares/auth.middleware.js';
import {
  registerRules,
  loginRules,
  verifyRegistrationOtpRules,
  resendRegistrationOtpRules,
  forgotPasswordRules,
  resetPasswordRules,
  changePasswordRules,
  oauthRules,
} from '../validations/auth.validation.js';

const router = Router();

router.post('/register', registerRules, register);
router.post('/verify-registration-otp', verifyRegistrationOtpRules, verifyRegistrationOtp);
router.post('/resend-registration-otp', resendRegistrationOtpRules, resendRegistrationOtp);
router.post('/login', loginRules, login);
router.post('/forgot-password', forgotPasswordRules, forgotPassword);
router.post('/reset-password/:token', resetPasswordRules, resetPassword);

router.post('/oauth', oauthRules, oauthLogin);

// Protected routes
router.use(authenticate);

router.get('/me', getMe);
router.post('/change-password', changePasswordRules, changePassword);

export default router;