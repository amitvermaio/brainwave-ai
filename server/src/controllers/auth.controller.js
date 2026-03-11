import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.model.js';
import config from '../config/config.js';
import AppError from '../utils/AppError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    const user = await User.create({ name, email, password, provider: 'local' });

    const token = generateToken(user._id);

    res.status(201).json(
      new ApiResponse(
        201,
        {
          token,
          user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
        },
        "User registered successfully"
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

    if (!['google', 'github'].includes(provider)) {
      throw new AppError('Unsupported OAuth provider', 400);
    }

    let user = await User.findOne({ provider, providerId });

    if (!user) {
      // Check if email already exists with a different provider
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AppError(`Email already registered with ${existingUser.provider}`, 409);
      }

      user = await User.create({ name, email, avatar, provider, providerId });
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