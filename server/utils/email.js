const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const emailTemplate = (username, code) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Account - Waya's Wheel of Regret</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #1a1a1a;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 0 30px rgba(255, 0, 0, 0.3);
    }
    .header {
      background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      color: #fff;
      margin: 0;
      font-size: 28px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .content {
      padding: 40px;
      color: #fff;
    }
    .welcome {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #ff0000;
    }
    .username {
      font-size: 18px;
      margin-bottom: 30px;
      color: rgba(255, 255, 255, 0.8);
    }
    .code-section {
      background: rgba(255, 0, 0, 0.1);
      border: 2px solid rgba(255, 0, 0, 0.3);
      border-radius: 15px;
      padding: 25px;
      text-align: center;
      margin: 30px 0;
    }
    .code-label {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 10px;
    }
    .code {
      font-size: 36px;
      font-weight: bold;
      color: #ff0000;
      letter-spacing: 8px;
      margin: 10px 0;
    }
    .footer {
      background: rgba(0, 0, 0, 0.3);
      padding: 20px;
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
    }
    .branding {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15px;
      margin-top: 15px;
    }
    .branding-text {
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Waya's Wheel of Regret</h1>
    </div>
    <div class="content">
      <div class="welcome">Welcome to the Wheel!</div>
      <div class="username">
        Hey ${username}!
      </div>
      <p>Thank you for signing up. To complete your registration, please use the verification code below:</p>
      
      <div class="code-section">
        <div class="code-label">Your Verification Code</div>
        <div class="code">${code}</div>
      </div>
      
      <p style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">
        This code will expire in 15 minutes. If you didn't request this, please ignore this email.
      </p>
      
      <div class="footer">
        <div class="branding">
          <span class="branding-text">Made by</span>
          <span class="branding-text">WayaCreate</span>
          <span class="branding-text">&</span>
          <span class="branding-text">TCOF Studios</span>
        </div>
        <p style="margin-top: 10px;">© 2026 Waya's Wheel of Regret. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

async function sendVerificationCode(email, username, code) {
  console.log('=== SENDING VERIFICATION EMAIL ===');
  console.log(`Email: ${email}`);
  console.log(`Username: ${username}`);
  console.log(`Code: ${code}`);
  console.log(`Resend API Key configured: ${!!process.env.RESEND_API_KEY}`);
  console.log('====================================');

  try {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {
      console.log('=== EMAIL NOT CONFIGURED - LOGGING CODE ONLY ===');
      console.log(`Email: ${email}`);
      console.log(`Username: ${username}`);
      console.log(`Code: ${code}`);
      console.log('================================================');
      return { success: true, message: 'Code logged (configure RESEND_API_KEY to send emails)' };
    }

    const emailData = {
      from: 'onboarding@resend.dev',
      to: [email],
      subject: 'Verify Your Account - Waya\'s Wheel of Regret',
      html: emailTemplate(username, code),
    };

    console.log('Sending email with data:', {
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject
    });

    const data = await resend.emails.send(emailData);

    console.log('=== EMAIL SENT SUCCESSFULLY ===');
    console.log('Response:', data);
    console.log('==================================');
    return { success: true, data };
  } catch (error) {
    console.error('=== EMAIL SEND ERROR ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error statusCode:', error.statusCode);
    console.error('==========================');
    
    // Fallback to console log if email fails
    console.log('=== VERIFICATION CODE (EMAIL FAILED, FALLBACK) ===');
    console.log(`Email: ${email}`);
    console.log(`Username: ${username}`);
    console.log(`Code: ${code}`);
    console.log('================================================');
    return { success: true, message: 'Code logged (email failed, using fallback)' };
  }
}

module.exports = { sendVerificationCode };
