
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter;

try {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    console.log('⚠️ Email credentials missing in .env. Email sending will be simulated.');
  }
} catch (error) {
  console.error('Failed to create email transporter:', error);
}

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendOTP = async (to, otp, type = 'VERIFICATION') => {
  const subject = type === 'RESET' ? 'Password Reset OTP - Triksha' : 'Verify Your Account - Triksha';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #0d9488; margin: 0;">TRIKSHA</h1>
        <p style="color: #666; margin-top: 5px;">Your Health, Unified.</p>
      </div>
      
      <div style="background-color: #f9fafb; padding: 30px; border-radius: 8px; text-align: center;">
        <h2 style="color: #333; margin-bottom: 15px;">
          ${type === 'RESET' ? 'Reset Your Password' : 'Verify Your Email'}
        </h2>
        <p style="color: #555; font-size: 16px; margin-bottom: 25px;">
          Use the One-Time Password (OTP) below to complete your request. This code is valid for 10 minutes.
        </p>
        
        <div style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 6px; padding: 15px; display: inline-block;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0f766e;">${otp}</span>
        </div>
        
        <p style="color: #888; font-size: 14px; margin-top: 25px;">
          If you did not request this, please ignore this email.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #aaa; font-size: 12px;">
        &copy; ${new Date().getFullYear()} Triksha Health Platform. All rights reserved.
      </div>
    </div>
  `;

  return sendEmail(to, subject, htmlContent);
};
