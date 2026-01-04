/**
 * Email Service using Resend
 *
 * Handles all email sending functionality:
 * - Welcome emails with API keys
 * - API key reset notifications
 * - Admin notifications
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface SendWelcomeEmailParams {
  email: string;
  apiKey: string;
  isNew: boolean;
}

interface SendResetEmailParams {
  email: string;
  apiKey: string;
}

/**
 * Send email using Resend API
 */
async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<void> {
  // Check if email is enabled
  const emailEnabled = process.env.EMAIL_ENABLED === 'true';
  if (!emailEnabled) {
    console.log('[EMAIL] Email disabled, skipping send to:', to);
    return;
  }

  const emailFrom = process.env.EMAIL_FROM || 'USWDS MCP <noreply@mail.uswdsmcp.com>';

  try {
    // Get Resend API key from environment (injected by SST from Secret)
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error('[EMAIL] RESEND_API_KEY not configured');
      return;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [to],
        subject,
        html,
        text: text || stripHtml(html),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[EMAIL] Failed to send email:', error);
      throw new Error(`Email send failed: ${response.status} ${error}`);
    }

    const data = await response.json();
    console.log('[EMAIL] Email sent successfully:', data.id);
  } catch (error) {
    console.error('[EMAIL] Error sending email:', error);
    // Don't throw - email failures shouldn't block the main flow
  }
}

/**
 * Strip HTML tags for plain text version
 */
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Send welcome email with API key
 */
export async function sendWelcomeEmail({ email, apiKey, isNew }: SendWelcomeEmailParams): Promise<void> {
  const subject = isNew
    ? 'Welcome to USWDS MCP - Your API Key'
    : 'USWDS MCP - New API Key Generated';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: 'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1b1b1b; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #005ea2; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">USWDS MCP Server</h1>
    <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Build Accessible Government Websites with AI</p>
  </div>

  <div style="background-color: #f0f0f0; padding: 30px 20px; border-radius: 0 0 8px 8px;">
    <h2 style="color: #1b1b1b; margin-top: 0;">${isNew ? 'Welcome!' : 'API Key Reset'}</h2>

    <p style="font-size: 16px;">
      ${isNew
        ? `Thank you for signing up for the USWDS MCP Server! Your API key has been generated and is ready to use.`
        : `Your API key has been reset. Your previous key has been invalidated.`
      }
    </p>

    <div style="background-color: #ffffff; border-left: 4px solid: #005ea2; padding: 20px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0 0 10px 0; font-weight: bold; color: #1b1b1b;">Your API Key:</p>
      <code style="display: block; background-color: #f0f0f0; padding: 15px; border-radius: 4px; font-family: 'Roboto Mono', monospace; font-size: 14px; word-break: break-all; color: #1b1b1b;">
        ${apiKey}
      </code>
    </div>

    <div style="background-color: #fef4e4; border-left: 4px solid: #ffbe2e; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #1b1b1b;">
        <strong>⚠️ Security Notice:</strong> Keep this API key secure and never share it publicly. This is the only time you'll see this key via email.
      </p>
    </div>

    <h3 style="color: #1b1b1b; margin-top: 30px;">Getting Started</h3>

    <p style="font-size: 15px;">With your free tier account, you get:</p>
    <ul style="font-size: 15px; line-height: 1.8;">
      <li>1 request per minute</li>
      <li>100 requests per day</li>
      <li>Access to all USWDS components</li>
      <li>React and Vanilla JS code generation</li>
    </ul>

    <p style="font-size: 15px;">
      Need more? Check out our <a href="https://uswdsmcp.com/pricing" style="color: #005ea2; text-decoration: none;">pricing plans</a> or <a href="https://github.com/YOUR-ORG/uswds-local-mcp-server" style="color: #005ea2; text-decoration: none;">self-host</a> for unlimited access.
    </p>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dfe1e2;">
      <p style="font-size: 14px; color: #71767a; margin: 0;">
        📚 <a href="https://uswdsmcp.com/docs/getting-started" style="color: #005ea2; text-decoration: none;">Documentation</a> |
        💬 <a href="https://github.com/YOUR-ORG/uswds-local-mcp-server/issues" style="color: #005ea2; text-decoration: none;">Support</a> |
        🔒 <a href="https://uswdsmcp.com/privacy" style="color: #005ea2; text-decoration: none;">Privacy Policy</a>
      </p>
    </div>
  </div>

  <div style="text-align: center; padding: 20px; font-size: 12px; color: #71767a;">
    <p style="margin: 0;">
      USWDS MCP Server is open source (AGPL-3.0) and built for the community.
    </p>
    <p style="margin: 10px 0 0 0;">
      <a href="https://uswdsmcp.com" style="color: #005ea2; text-decoration: none;">uswdsmcp.com</a>
    </p>
  </div>
</body>
</html>
  `;

  await sendEmail({
    to: email,
    subject,
    html,
  });
}

/**
 * Send password reset / API key reset email
 */
export async function sendResetEmail({ email, apiKey }: SendResetEmailParams): Promise<void> {
  const subject = 'USWDS MCP - API Key Reset Confirmation';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: 'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1b1b1b; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #005ea2; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">USWDS MCP Server</h1>
  </div>

  <div style="background-color: #f0f0f0; padding: 30px 20px; border-radius: 0 0 8px 8px;">
    <h2 style="color: #1b1b1b; margin-top: 0;">API Key Reset</h2>

    <p style="font-size: 16px;">
      Your API key has been successfully reset. Your previous API key has been invalidated and will no longer work.
    </p>

    <div style="background-color: #ffffff; border-left: 4px solid: #005ea2; padding: 20px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0 0 10px 0; font-weight: bold; color: #1b1b1b;">Your New API Key:</p>
      <code style="display: block; background-color: #f0f0f0; padding: 15px; border-radius: 4px; font-family: 'Roboto Mono', monospace; font-size: 14px; word-break: break-all; color: #1b1b1b;">
        ${apiKey}
      </code>
    </div>

    <div style="background-color: #e7f6f8; border-left: 4px solid: #00bde3; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #1b1b1b;">
        <strong>ℹ️ Note:</strong> If you didn't request this reset, please contact support immediately.
      </p>
    </div>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dfe1e2;">
      <p style="font-size: 14px; color: #71767a; margin: 0;">
        Need help? <a href="https://github.com/YOUR-ORG/uswds-local-mcp-server/issues" style="color: #005ea2; text-decoration: none;">Contact Support</a>
      </p>
    </div>
  </div>

  <div style="text-align: center; padding: 20px; font-size: 12px; color: #71767a;">
    <p style="margin: 0;">
      <a href="https://uswdsmcp.com" style="color: #005ea2; text-decoration: none;">uswdsmcp.com</a>
    </p>
  </div>
</body>
</html>
  `;

  await sendEmail({
    to: email,
    subject,
    html,
  });
}
