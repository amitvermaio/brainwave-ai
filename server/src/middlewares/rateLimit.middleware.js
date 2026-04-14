import rateLimit from 'express-rate-limit';

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 10,
  message: { error: 'Too many accounts created. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  message: { error: 'Too many login attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: { error: 'Too many OTP attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 5,
  message: { error: 'Too many password reset requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});


export const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: { error: 'Generation limit reached. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const chatLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 20,
  message: { error: 'Too many messages. Slow down a little.' },
  standardHeaders: true,
  legacyHeaders: false,
});