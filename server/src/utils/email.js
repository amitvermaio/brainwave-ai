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

export const sendWelcomeEmail = async ({ to, name }) => {
  const dashboardUrl = `${config.frontendUrl}/dashboard`;
  const { error } = await resend.emails.send({
    from: config.resendFrom,
    to,
    subject: 'Welcome to BrainwaveAI 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    padding: 32px 36px; border-radius: 10px 10px 0 0;">
          <div style="font-size: 20px; font-weight: 800; color: #fff;">🧠 BrainwaveAI</div>
          <div style="color: rgba(255,255,255,0.75); font-size: 13px; margin-top: 4px;">
            Your AI-powered workspace
          </div>
        </div>

        <!-- Body -->
        <div style="background: #fff; padding: 36px; border: 1px solid #e2e8f0;
                    border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="margin: 0 0 8px; font-size: 22px;">Welcome aboard, ${name}! 🎉</h2>
          <p style="color: #475569; margin: 0 0 24px; line-height: 1.6;">
            We're thrilled to have you join BrainwaveAI. Your account is verified and ready to go.
          </p>

          <!-- Feature highlights -->
          <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <div style="font-weight: 700; margin-bottom: 14px; color: #1e293b;">
              What you can do with BrainwaveAI:
            </div>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="28" valign="top" style="color: #6366f1; font-size: 16px; padding-bottom: 12px;">⚡</td>
                <td style="color: #475569; font-size: 14px; line-height: 1.5; padding-bottom: 12px;">
                  <strong style="color: #1e293b;">AI Chat</strong> — Ask anything and get intelligent,
                  context-aware answers instantly.
                </td>
              </tr>
              <tr>
                <td width="28" valign="top" style="color: #6366f1; font-size: 16px; padding-bottom: 12px;">📄</td>
                <td style="color: #475569; font-size: 14px; line-height: 1.5; padding-bottom: 12px;">
                  <strong style="color: #1e293b;">Document Analysis</strong> — Upload documents and
                  extract key insights in seconds.
                </td>
              </tr>
              <tr>
                <td width="28" valign="top" style="color: #6366f1; font-size: 16px;">🔗</td>
                <td style="color: #475569; font-size: 14px; line-height: 1.5;">
                  <strong style="color: #1e293b;">Integrations</strong> — Connect your favourite tools
                  and supercharge your workflow.
                </td>
              </tr>
            </table>
          </div>

          <!-- CTA -->
          <a href="${dashboardUrl}"
             style="display: inline-block; padding: 13px 28px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: #fff; text-decoration: none; border-radius: 8px;
                    font-weight: 700; font-size: 15px; margin-bottom: 24px;">
            Go to Dashboard →
          </a>

          <p style="color: #64748b; font-size: 13px; margin: 0; line-height: 1.6;">
            Need help getting started? Just reply to this email — we're always happy to assist.
          </p>
        </div>

        <!-- Footer -->
        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">
          © ${new Date().getFullYear()} BrainwaveAI · You received this because you created an account.
        </p>

      </div>
    `,
  });
  if (error) {
    console.error(`Failed to send welcome email to ${to}:`, error);
    throw new Error('Failed to send welcome email');
  }
};