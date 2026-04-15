import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.model.js';
import redis from '../config/redis.js';
import config from '../config/config.js';
import AppError from '../utils/AppError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { 
  sendVerificationOtpEmail, 
  sendResetPasswordEmail,
  sendWelcomeEmail
} from '../utils/email.js';


const OTP_TTL_SECONDS = 10 * 60;
const RESEND_COOLDOWN_SEC = 60;
const MAX_OTP_ATTEMPTS = 5;

const generateOtp = () => String(crypto.randomInt(100000, 1000000));

const hashValue = (value) => crypto.createHash('sha256').update(value).digest('hex');

const generateToken = (userId) =>
  jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

const redisKeys = {
  pending: (email) => `pending_user:${email}`,
  cooldown: (email) => `otp_cooldown:${email}`,
  attempts: (email) => `otp_attempts:${email}`,
};

const parsePendingRegistration = (value) => {
  if (!value) return null;
  if (typeof value === 'object') return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      throw new AppError('Corrupted pending registration data. Please register again.', 400);
    }
  }
  throw new AppError('Corrupted pending registration data. Please register again.', 400);
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    const cooldown = await redis.get(redisKeys.cooldown(email));
    if (cooldown) {
      throw new AppError('Please wait 60 seconds before requesting a new OTP', 429);
    }

    const otp = generateOtp();

    await redis.set(
      redisKeys.pending(email),
      {
        name,
        email,
        password,
        otpHash: hashValue(otp),
      },
      { ex: OTP_TTL_SECONDS }
    );

    await redis.set(redisKeys.cooldown(email), '1', { ex: RESEND_COOLDOWN_SEC });

    sendVerificationOtpEmail({ to: email, name, otp })
      .catch(err => console.error('OTP email failed:', err));

    res.status(201).json(
      new ApiResponse(201, { email }, 'OTP sent. Verify your email to complete registration.')
    );
  } catch (error) {
    next(error);
  }
};

export const verifyRegistrationOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const pendingKey = redisKeys.pending(email);
    const attemptKey = redisKeys.attempts(email);

    const raw = await redis.get(pendingKey);

    if (!raw) {
      throw new AppError('OTP expired or not found. Please register again.', 400);
    }

    const attempts = parseInt(await redis.get(attemptKey) ?? '0');
    if (attempts >= MAX_OTP_ATTEMPTS) {
      await redis.del(pendingKey);
      throw new AppError('Too many incorrect attempts. Please register again.', 429);
    }

    const pending = parsePendingRegistration(raw);

    if (pending.otpHash !== hashValue(otp)) {
      await redis.incr(attemptKey);
      await redis.expire(attemptKey, OTP_TTL_SECONDS);
      throw new AppError('Invalid OTP', 400);
    }

    const user = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      provider: 'local',
      isVerified: true,
    });

    await redis.del(pendingKey);
    await redis.del(attemptKey);

    const token = generateToken(user._id);

    sendWelcomeEmail({ to: user.email, name: user.name })
      .catch(err => console.error('OTP email failed:', err));

    res.status(200).json(
      new ApiResponse(
        200,
        { token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } },
        'Email verified. Registration completed successfully.'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const resendRegistrationOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json(
        new ApiResponse(200, null, 'Email is already verified. Please login.')
      );
    }

    const cooldown = await redis.get(redisKeys.cooldown(email));
    if (cooldown) {
      throw new AppError('Please wait 60 seconds before requesting a new OTP', 429);
    }

    const raw = await redis.get(redisKeys.pending(email));
    if (!raw) {
      throw new AppError('No pending registration found. Please register again.', 400);
    }

    const pending = parsePendingRegistration(raw);
    const otp = generateOtp();

    await redis.set(
      redisKeys.pending(email),
      { ...pending, otpHash: hashValue(otp) },
      { ex: OTP_TTL_SECONDS }
    );

    await redis.del(redisKeys.attempts(email));
    await redis.set(redisKeys.cooldown(email), '1', { ex: RESEND_COOLDOWN_SEC });

    await sendVerificationOtpEmail({ to: email, name: pending.name, otp });

    res.status(200).json(
      new ApiResponse(200, { email }, 'A new OTP has been sent to your email.')
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || user.provider !== 'local') {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken(user._id);

    res.status(200).json(
      new ApiResponse(
        200,
        { token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } },
        'User logged in successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};


export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404);

    res.status(200).json(
      new ApiResponse(
        200,
        { user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, provider: user.provider } },
        'User profile fetched successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.provider !== 'local') {
      return res.status(200).json(
        new ApiResponse(200, null, 'If that email is registered, a reset link has been sent.')
      );
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    await redis.set(
      `reset_token:${hashValue(resetToken)}`,
      user._id.toString(),
      { ex: 60 * 60 }
    );

    sendResetPasswordEmail({ to: user.email, name: user.name, token: resetToken })
      .catch(err => console.error('Reset email failed:', err));

    res.status(200).json(
      new ApiResponse(200, null, 'If that email is registered, a reset link has been sent.')
    );
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = hashValue(req.params.token);
    const { password } = req.body;

    const userId = await redis.get(`reset_token:${hashedToken}`);
    if (!userId) throw new AppError('Token is invalid or has expired', 400);

    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);

    user.password = password;
    await user.save();

    await redis.del(`reset_token:${hashedToken}`);

    const token = generateToken(user._id);

    res.status(200).json(new ApiResponse(200, { token }, 'Password reset successful'));
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new AppError('Current password is incorrect', 401);

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json(new ApiResponse(200, { token }, 'Password changed successfully'));
  } catch (error) {
    next(error);
  }
};


export const oauthLogin = async (req, res, next) => {
  try {
    const { provider, providerId, email, name, avatar } = req.body;

    if (!['google'].includes(provider)) {
      throw new AppError('Unsupported OAuth provider', 400);
    }

    let user = await User.findOne({ provider, providerId });

    if (!user) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AppError(`Email already registered with ${existingUser.provider}`, 409);
      }
      user = await User.create({ name, email, avatar, provider, providerId, isVerified: true });
    }

    const token = generateToken(user._id);

    res.status(200).json(
      new ApiResponse(
        200,
        { token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, provider: user.provider } },
        'User logged in successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};