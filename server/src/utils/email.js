import nodemailer from 'nodemailer';
import config from '../config/config.js';

const hasSmtpConfig = Boolean(config.smtpHost && config.smtpUser && config.smtpPass);

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    })
  : nodemailer.createTransport({ jsonTransport: true });

export const sendVerificationOtpEmail = async ({ to, name, otp }) => {
  const subject = 'Verify your BrainWave AI account';
  const text = `Hi ${name},\n\nYour verification OTP is: ${otp}\nThis code will expire in 10 minutes.\n\nIf you did not request this, you can ignore this email.`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
      <h2 style="margin-bottom: 8px;">Verify your account</h2>
      <p style="margin-bottom: 16px;">Hi ${name},</p>
      <p style="margin-bottom: 10px;">Use this OTP to complete your registration:</p>
      <div style="font-size: 28px; letter-spacing: 8px; font-weight: 700; margin: 20px 0;">${otp}</div>
      <p style="margin-bottom: 4px;">This code expires in 10 minutes.</p>
      <p>If you did not request this, you can ignore this email.</p>
    </div>
  `;

  const info = await transporter.sendMail({
    from: config.smtpFrom || config.smtpUser || 'no-reply@brainwave.local',
    to,
    subject,
    text,
    html,
  });

  if (!hasSmtpConfig && info?.message) {
    console.log(`Mock email payload for ${to}:`, info.message.toString());
  }
};
