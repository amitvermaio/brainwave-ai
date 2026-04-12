import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import config from '../config/config.js';
import AppError from '../utils/AppError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { sendVerificationOtpEmail } from '../utils/email.js';

const OTP_EXPIRY_MS = 10 * 60 * 1000;

const generateOtp = () => String(crypto.randomInt(100000, 1000000));

const hashValue = (value) => crypto.createHash('sha256').update(value).digest('hex');

const runWithTransactionFallback = async (work) => {
  const session = await mongoose.startSession();

  try {
    let result;
    await session.withTransaction(async () => {
      result = await work(session);
    });
    return result;
  } catch (error) {
    const transactionsNotSupported = error?.message?.includes('Transaction numbers are only allowed on a replica set member or mongos');
    if (!transactionsNotSupported) {
      throw error;
    }

    return work();
  } finally {
    await session.endSession();
  }
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const otp = generateOtp();
    const emailVerificationOtpHash = hashValue(otp);
    const emailVerificationOtpExpires = new Date(Date.now() + OTP_EXPIRY_MS);

    const user = await runWithTransactionFallback(async (session) => {
      const userQuery = User.findOne({ email: normalizedEmail });
      if (session) {
        userQuery.session(session);
      }
      const existingUser = await userQuery;

      if (existingUser && existingUser.isVerified) {
        throw new AppError('Email already registered', 409);
      }

      if (existingUser && existingUser.provider !== 'local') {
        throw new AppError(`Email already registered with ${existingUser.provider}`, 409);
      }

      if (existingUser) {
        existingUser.name = name;
        existingUser.password = password;
        existingUser.provider = 'local';
        existingUser.isVerified = false;
        existingUser.emailVerificationOtpHash = emailVerificationOtpHash;
        existingUser.emailVerificationOtpExpires = emailVerificationOtpExpires;
        await existingUser.save({ session });
        return existingUser;
      }

      const createdUsers = await User.create([
        {
          name,
          email: normalizedEmail,
          password,
          provider: 'local',
          isVerified: false,
          emailVerificationOtpHash,
          emailVerificationOtpExpires,
        },
      ], session ? { session } : undefined);

      return createdUsers[0];
    });

    await sendVerificationOtpEmail({ to: user.email, name: user.name, otp });

    res.status(201).json(
      new ApiResponse(
        201,
        {
          requiresVerification: true,
          email: user.email,
        },
        'Registration started. Verify OTP to complete signup.'
      )
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

    if (!user.isVerified) {
      throw new AppError('Please verify your email before logging in', 403);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken(user._id);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          token,
          user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
        },
        "User logged in successfully"
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
        {
          user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, provider: user.provider },
        },
        "User profile fetched successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).select('+resetPasswordToken +resetPasswordExpires');
    if (!user || user.provider !== 'local') {
      return res.status(200).json(
        new ApiResponse(
          200,
          null,
          'If that email is registered, a reset link has been sent.'
        )
      );
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; 
    await user.save({ validateBeforeSave: false });

    // TODO: Send email with reset link containing resetToken
    // const resetUrl = `${config.frontendUrl}/reset-password/${resetToken}`;

    res.status(200).json(
      new ApiResponse(
        200,
        null,
        'If that email is registered, a reset link has been sent.'
      )
    );
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/reset-password/:token
export const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) throw new AppError('Token is invalid or has expired', 400);

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json(
      new ApiResponse(
        200,
        { token },
        'Password reset successful'
      )
    );
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

    res.status(200).json(
      new ApiResponse(
        200,
        { token },
        'Password changed successfully'
      )
    );
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
      // Check if email already exists with a different provider
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
        {
          token,
          user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, provider: user.provider },
        },
        "User logged in successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const verifyRegistrationOtp = async (req, res, next) => {
  try {
    const normalizedEmail = req.body.email.trim().toLowerCase();
    const { otp } = req.body;

    const user = await User.findOne({ email: normalizedEmail, provider: 'local' })
      .select('+emailVerificationOtpHash +emailVerificationOtpExpires');

    if (!user) {
      throw new AppError('Invalid OTP or email', 400);
    }

    if (!user.emailVerificationOtpHash || !user.emailVerificationOtpExpires || user.emailVerificationOtpExpires < new Date()) {
      throw new AppError('OTP is invalid or expired', 400);
    }

    const otpHash = hashValue(otp);
    if (user.emailVerificationOtpHash !== otpHash) {
      throw new AppError('Invalid OTP', 400);
    }

    user.isVerified = true;
    user.emailVerificationOtpHash = undefined;
    user.emailVerificationOtpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          token,
          user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
        },
        'Email verified. Registration completed successfully.'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const resendRegistrationOtp = async (req, res, next) => {
  try {
    const normalizedEmail = req.body.email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail, provider: 'local' })
      .select('+emailVerificationOtpHash +emailVerificationOtpExpires');

    if (!user) {
      return res.status(200).json(
        new ApiResponse(
          200,
          null,
          'If this email is pending verification, a new OTP has been sent.'
        )
      );
    }

    if (user.isVerified) {
      return res.status(200).json(
        new ApiResponse(
          200,
          null,
          'Email is already verified. Please login.'
        )
      );
    }

    const otp = generateOtp();
    user.emailVerificationOtpHash = hashValue(otp);
    user.emailVerificationOtpExpires = new Date(Date.now() + OTP_EXPIRY_MS);
    await user.save({ validateBeforeSave: false });

    await sendVerificationOtpEmail({ to: user.email, name: user.name, otp });

    res.status(200).json(
      new ApiResponse(
        200,
        { email: user.email },
        'A new OTP has been sent to your email.'
      )
    );
  } catch (error) {
    next(error);
  }
};