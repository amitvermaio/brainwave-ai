import { Router } from 'express';
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
  googleOAuth,
  verifyRegistrationOtp,
  resendRegistrationOtp,
} from '../controllers/auth.controller.js';
import authenticate from '../middlewares/auth.middleware.js';
import {
  registerLimiter,
  loginLimiter,
  otpLimiter,
  forgotPasswordLimiter
} from '../middlewares/rateLimit.middleware.js';

import {
  registerRules,
  loginRules,
  verifyRegistrationOtpRules,
  resendRegistrationOtpRules,
  forgotPasswordRules,
  resetPasswordRules,
  changePasswordRules,
} from '../validations/auth.validation.js';
import passport from '../config/passport.js';
import config from '../config/config.js';

const router = Router();

router.post('/register', registerLimiter, registerRules, register);
router.post('/verify-registration-otp', otpLimiter, verifyRegistrationOtpRules, verifyRegistrationOtp);
router.post('/resend-registration-otp', otpLimiter, resendRegistrationOtpRules, resendRegistrationOtp);
router.post('/login', loginLimiter, loginRules, login);
router.post('/forgot-password', forgotPasswordLimiter, forgotPasswordRules, forgotPassword);
router.post('/reset-password/:token', forgotPasswordLimiter, resetPasswordRules, resetPassword);
// auth prefix in route.js
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${config.frontendUrl}/login` }),
  googleOAuth
)

// Protected routes
router.use(authenticate);

router.get('/me', getMe);
router.post('/change-password', changePasswordRules, changePassword);

export default router;