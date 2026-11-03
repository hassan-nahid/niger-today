const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("../config/logger");

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch((err) =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env",
      ),
    );
}

const sendEmail = async (to, subject, html, text) => {
  const msg = { from: config.email.from, to, subject, html, text };
  await transport.sendMail(msg);
};

/**
 * Escape HTML special characters for security
 */
const escapeHtml = (text) => {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Format user name safely
 */
const resolveUserName = (name) => {
  if (name && typeof name === "string" && name.trim()) {
    return escapeHtml(name.trim());
  }
  return "User";
};

/**
 * Professional Base layout wrapper for all outgoing transactional emails
 */
const renderEmailLayout = ({
  previewText = "",
  headerCategory = "Security Notification",
  contentHtml = "",
}) => {
  const currentYear = new Date().getFullYear();
  const appName = config.appName || "Nexora";

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${headerCategory}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @media only screen and (max-width: 600px) {
      .email-wrapper { padding: 16px 8px !important; }
      .email-card { border-radius: 8px !important; }
      .email-content { padding: 28px 20px !important; }
      .email-header { padding: 24px 20px 16px 20px !important; }
      .otp-display { font-size: 28px !important; letter-spacing: 6px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <!-- Hidden preview text for inbox clients -->
  <div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all;">
    ${previewText}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; width: 100%; margin: 0; padding: 40px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" class="email-card" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);">
          
          <!-- Top Accent Line -->
          <tr>
            <td style="height: 3px; background-color: #0f172a;"></td>
          </tr>

          <!-- Brand Header -->
          <tr>
            <td class="email-header" align="left" style="padding: 32px 40px 16px 40px; border-bottom: 1px solid #f1f5f9;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <div style="font-size: 18px; font-weight: 800; letter-spacing: 1px; color: #0f172a; text-transform: uppercase;">
                      ${appName}
                    </div>
                  </td>
                  <td align="right">
                    <span style="font-size: 11px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: #64748b; background-color: #f1f5f9; padding: 4px 10px; border-radius: 4px;">
                      ${headerCategory}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td class="email-content" style="padding: 32px 40px 36px 40px;">
              ${contentHtml}

              <!-- Security Warning Callout -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border-left: 3px solid #0f172a; border-radius: 0 6px 6px 0; margin-top: 32px;">
                <tr>
                  <td style="padding: 14px 16px; font-size: 13px; line-height: 20px; color: #475569;">
                    <strong style="color: #0f172a;">Security Advisory:</strong> Never share this code or link with anyone. The ${appName} team will never contact you asking for your verification code.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #ffffff; border-top: 1px solid #f1f5f9; padding: 24px 40px; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 12px; line-height: 18px; color: #64748b;">
                This is an automated notification from ${appName}. Please do not reply directly to this message.
              </p>
              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #94a3b8;">
                &copy; ${currentYear} ${appName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const sendEmailVerification = async (to, otp, name = "User") => {
  const recipientName = resolveUserName(name);
  const appName = config.appName || "Nexora";
  const subject = `Verify Your Email Address - ${appName}`;

  const contentHtml = `
    <h1 style="margin: 0 0 16px; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; line-height: 1.3;">
      Verify your email address
    </h1>

    <p style="margin: 0 0 16px; font-size: 15px; line-height: 24px; color: #334155;">
      Hello <strong style="color: #0f172a;">${recipientName}</strong>,
    </p>

    <p style="margin: 0 0 24px; font-size: 15px; line-height: 24px; color: #475569;">
      Thank you for creating an account with <strong>${appName}</strong>. To complete your verification and secure your account, please enter the one-time code below:
    </p>

    <!-- OTP Card Container -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin: 24px 0;">
      <tr>
        <td align="center" style="padding: 24px 16px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin-bottom: 8px;">
            Verification Code
          </div>
          <div class="otp-display" style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace; font-size: 34px; font-weight: 700; letter-spacing: 8px; color: #0f172a; padding: 4px 0;">
            ${otp}
          </div>
          <div style="margin-top: 8px; font-size: 12px; font-weight: 500; color: #64748b;">
            Valid for 3 minutes
          </div>
        </td>
      </tr>
    </table>

    <p style="margin: 0; font-size: 14px; line-height: 22px; color: #64748b;">
      If you did not initiate this request, no further action is required and you can safely ignore this email.
    </p>
  `;

  const html = renderEmailLayout({
    previewText: `Your ${appName} verification code is ${otp}. Valid for 3 minutes.`,
    headerCategory: "Account Verification",
    contentHtml,
  });

  const text = `Hello ${recipientName},

Thank you for creating an account with ${appName}.
Your one-time verification code is: ${otp}

This code will expire in 3 minutes.
If you did not create an account, please safely ignore this email.`;

  await sendEmail(to, subject, html, text);
};

const sendResetPasswordEmail = async (to, otp, name = "User") => {
  const recipientName = resolveUserName(name);
  const appName = config.appName || "Nexora";
  const subject = `Reset Your Password - ${appName}`;

  const contentHtml = `
    <h1 style="margin: 0 0 16px; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; line-height: 1.3;">
      Reset your password
    </h1>

    <p style="margin: 0 0 16px; font-size: 15px; line-height: 24px; color: #334155;">
      Hello <strong style="color: #0f172a;">${recipientName}</strong>,
    </p>

    <p style="margin: 0 0 24px; font-size: 15px; line-height: 24px; color: #475569;">
      We received a request to reset the password for your <strong>${appName}</strong> account. Please use the one-time security code below to complete the process:
    </p>

    <!-- OTP Card Container -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin: 24px 0;">
      <tr>
        <td align="center" style="padding: 24px 16px;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin-bottom: 8px;">
            Password Reset Code
          </div>
          <div class="otp-display" style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace; font-size: 34px; font-weight: 700; letter-spacing: 8px; color: #0f172a; padding: 4px 0;">
            ${otp}
          </div>
          <div style="margin-top: 8px; font-size: 12px; font-weight: 500; color: #64748b;">
            Valid for 3 minutes
          </div>
        </td>
      </tr>
    </table>

    <p style="margin: 0; font-size: 14px; line-height: 22px; color: #64748b;">
      If you did not request a password reset, your credentials are still secure and you can safely ignore this email.
    </p>
  `;

  const html = renderEmailLayout({
    previewText: `Your password reset code is ${otp}. Valid for 3 minutes.`,
    headerCategory: "Password Reset",
    contentHtml,
  });

  const text = `Hello ${recipientName},

We received a request to reset the password for your ${appName} account.
Your one-time password reset code is: ${otp}

This code will expire in 3 minutes.
If you did not request a password reset, please ignore this email.`;

  await sendEmail(to, subject, html, text);
};

const sendVerificationEmail = async (to, token, name = "User") => {
  const recipientName = resolveUserName(name);
  const appName = config.appName || "Nexora";
  const subject = `Verify Your Email Address - ${appName}`;
  const verificationEmailUrl = `http://localhost:5173/verify-email?token=${token}`;

  const contentHtml = `
    <h1 style="margin: 0 0 16px; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; line-height: 1.3;">
      Verify your email address
    </h1>

    <p style="margin: 0 0 16px; font-size: 15px; line-height: 24px; color: #334155;">
      Hello <strong style="color: #0f172a;">${recipientName}</strong>,
    </p>

    <p style="margin: 0 0 24px; font-size: 15px; line-height: 24px; color: #475569;">
      Thank you for joining <strong>${appName}</strong>. Please confirm your email address by clicking the verification button below:
    </p>

    <!-- Action Button Container -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 28px auto;">
      <tr>
        <td align="center" style="border-radius: 6px; background-color: #0f172a;">
          <a href="${verificationEmailUrl}" target="_blank" style="display: inline-block; padding: 13px 32px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px; letter-spacing: 0.2px;">
            Verify Email Address
          </a>
        </td>
      </tr>
    </table>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; margin-top: 24px; word-break: break-all;">
      <p style="margin: 0 0 6px; font-size: 12px; color: #64748b; font-weight: 500;">
        If the button above does not work, copy and paste this URL into your browser:
      </p>
      <a href="${verificationEmailUrl}" target="_blank" style="font-size: 12px; color: #2563eb; text-decoration: underline;">
        ${verificationEmailUrl}
      </a>
    </div>

    <p style="margin: 20px 0 0; font-size: 14px; line-height: 22px; color: #64748b;">
      If you did not register for an account, please safely ignore this email.
    </p>
  `;

  const html = renderEmailLayout({
    previewText: `Please verify your email address to get started with ${appName}.`,
    headerCategory: "Account Activation",
    contentHtml,
  });

  const text = `Hello ${recipientName},

To verify your email address for ${appName}, please open the following link:
${verificationEmailUrl}

If you did not register for an account, please ignore this email.`;

  await sendEmail(to, subject, html, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendEmailVerification,
};
