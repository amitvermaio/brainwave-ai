import { Resend } from 'resend';
import config from '../config/config.js';

const resend = new Resend(config.resendApiKey);

export const sendVerificationOtpEmail = async ({ to, name, otp }) => {
  const { error } = await resend.emails.send({
    from: config.resendFrom,
    to,
    subject: 'Verify your BrainWave AI account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
        <h2 style="margin-bottom: 8px;">Verify your account</h2>
        <p style="margin-bottom: 16px;">Hi ${name},</p>
        <p style="margin-bottom: 10px;">Use this OTP to complete your registration:</p>
        <div style="font-size: 28px; letter-spacing: 8px; font-weight: 700; margin: 20px 0;">${otp}</div>
        <p style="margin-bottom: 4px;">This code expires in 10 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.error(`Failed to send OTP email to ${to}:`, error);
    throw new Error('Failed to send verification email');
  }
};

export const sendResetPasswordEmail = async ({ to, name, token }) => {
  const resetUrl = `${config.frontendUrl}/reset-password/${token}`;

  const { error } = await resend.emails.send({
    from: config.resendFrom,
    to,
    subject: 'Reset your BrainWave AI password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
        <h2 style="margin-bottom: 8px;">Reset your password</h2>
        <p style="margin-bottom: 16px;">Hi ${name},</p>
        <p style="margin-bottom: 10px;">Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}"
           style="display: inline-block; padding: 12px 24px; background: #6366f1; color: #fff;
                  text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0;">
          Reset Password
        </a>
        <p style="margin-top: 16px;">Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.error(`Failed to send reset email to ${to}:`, error);
    throw new Error('Failed to send password reset email');
  }
};