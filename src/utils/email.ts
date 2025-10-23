import { createTransport } from 'nodemailer';
import { EMAIL_USERNAME, EMAIL_APP_PASSWORD } from '../configs/envConfig';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { mailLog } from '../configs/loggerConfig';

// Create email transporter using Gmail service 
const createEmailTransporter = () => {
    return createTransport({
        service: "gmail",
        auth: {
            user: EMAIL_USERNAME, // Gmail username
            pass: EMAIL_APP_PASSWORD, // Gmail App Password
        },
        tls: {
            rejectUnauthorized: false,
        },
        // logger: true,
        debug: true,
    } as SMTPTransport.Options);
};

export const sendOtpEmail = async (    
    name: string,
    email: string,
    otpCode: string
) => {
    const transporter = createEmailTransporter();

    const mailOptions = {
        from: `Kayode from Helperr <${EMAIL_USERNAME}>`,
        to: email,
        subject: "Verify your Helperr account - OTP Code",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Account</title>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    color: #333;
                }
                .container {
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    padding: 30px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .logo {
                    width: 200px;
                    margin: 0 auto 20px auto;
                    display: block;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .header h1 {
                    color: #6666ff;
                    margin: 0;
                    font-size: 24px;
                }
                .greeting {
                    font-size: 18px;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .message {
                    font-size: 16px;
                    line-height: 1.5;
                    margin-bottom: 25px;
                    text-align: center;
                }
                .otp-box {
                    background-color: #6666ff;
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    margin: 25px 0;
                }
                .otp-code {
                    font-size: 28px;
                    font-weight: bold;
                    letter-spacing: 3px;
                    margin: 0;
                }
                .note {
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                    font-size: 14px;
                    color: #666;
                    margin: 20px 0;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    color: #666;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://res.cloudinary.com/dpesanzkk/image/upload/v1757285362/my-helperr-1_xxjt9m.jpg" 
                         alt="Helperr Logo" class="logo">
                </div>
                
                <div class="greeting">Hello ${name}!</div>
                
                <div class="message">
                    Welcome to Helperr! Please use the code below to verify your account:
                </div>
                
                <div class="otp-box">
                    <div class="otp-code">${otpCode}</div>
                </div>
                
                <div class="note">
                    This code expires in 10 minutes. Don't share it with anyone.
                </div>
                
                <div class="footer">
                    Best regards,<br>
                    The Helperr Team
                </div>
            </div>
        </body>
        </html>
        `,
    };

    try {
       const info = await transporter.sendMail(mailOptions);
       mailLog.info(`OTP email sent to ${email}: ${info.response}`);
    } catch (error) {
        mailLog.error(`Error sending OTP email to ${email}: ${error}`);
    }
};

export const resendOtpEmail = async (    
    name: string,
    email: string,
    otpCode: string
) => {
    const transporter = createEmailTransporter();

    const mailOptions = {
        from: `Kayode from Helperr <${EMAIL_USERNAME}>`,
        to: email,
        subject: "Resend OTP Verification Code",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Verification Code</title>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    color: #333;
                }
                .container {
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    padding: 30px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .logo {
                    width: 200px;
                    margin: 0 auto 20px auto;
                    display: block;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .header h1 {
                    color: #6666ff;
                    margin: 0;
                    font-size: 24px;
                }
                .greeting {
                    font-size: 18px;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .message {
                    font-size: 16px;
                    line-height: 1.5;
                    margin-bottom: 25px;
                    text-align: center;
                }
                .otp-box {
                    background-color: #6666ff;
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    margin: 25px 0;
                }
                .otp-code {
                    font-size: 28px;
                    font-weight: bold;
                    letter-spacing: 3px;
                    margin: 0;
                }
                .note {
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                    font-size: 14px;
                    color: #666;
                    margin: 20px 0;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    color: #666;
                    font-size: 14px;
                }
                .resend-notice {
                    background-color: #fff3cd;
                    border: 1px solid #ffeaa7;
                    padding: 15px;
                    border-radius: 5px;
                    font-size: 14px;
                    color: #856404;
                    margin: 20px 0;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://res.cloudinary.com/dpesanzkk/image/upload/v1757285362/my-helperr-1_xxjt9m.jpg" 
                         alt="Helperr Logo" class="logo">
                </div>
                
                <div class="greeting">Hello ${name}!</div>
                
                <div class="message">
                   🔄 This is a new verification code as requested
                </div>
                
                <div class="otp-box">
                    <div class="otp-code">${otpCode}</div>
                </div>
                
                <div class="note">
                    This new code expires in 10 minutes and replaces any previous codes. Don't share it with anyone.
                </div>
                
                <div class="footer">
                    Having trouble? Contact our support team.<br>
                    Best regards,<br>
                    The Helperr Team
                </div>
            </div>
        </body>
        </html>
        `,
    };

    try {
       const info = await transporter.sendMail(mailOptions);
       mailLog.info(`Resend OTP email sent to ${email}: ${info.response}`);
    } catch (error) {
        mailLog.error(`Error sending resend OTP email to ${email}: ${error}`);
    }
};

export const sendPasswordResetEmail = async (name : string, email: string, otpCode: string) => {
    const transporter = createEmailTransporter();

    const mailOptions = {
        from: `Kayode from Helperr <${EMAIL_USERNAME}>`,
        to: email,
        subject: "Reset Your Helperr Password - OTP Code",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    color: #333;
                }
                .container {
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    padding: 30px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .logo {
                    width: 200px;
                    margin: 0 auto 20px auto;
                    display: block;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .header h1 {
                    color: #6666ff;
                    margin: 0;
                    font-size: 24px;
                }
                .greeting {
                    font-size: 18px;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .message {
                    font-size: 16px;
                    line-height: 1.5;
                    margin-bottom: 25px;
                    text-align: center;
                }
                .otp-box {
                    background-color: #6666ff;
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    margin: 25px 0;
                }
                .otp-code {
                    font-size: 28px;
                    font-weight: bold;
                    letter-spacing: 3px;
                    margin: 0;
                }
                .note {
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                    font-size: 14px;
                    color: #666;
                    margin: 20px 0;
                }
                .warning {
                    background-color: #fff3cd;
                    border: 1px solid #ffeaa7;
                    padding: 15px;
                    border-radius: 5px;
                    font-size: 14px;
                    color: #856404;
                    margin: 20px 0;
                    text-align: center;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    color: #666;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://res.cloudinary.com/dpesanzkk/image/upload/v1757285362/my-helperr-1_xxjt9m.jpg" 
                         alt="Helperr Logo" class="logo">
                </div>
                
                <div class="greeting">Hello ${name}!</div>
                
                <div class="message">
                    We received a request to reset your Helperr account password. Use the code below to proceed:
                </div>
                
                <div class="otp-box">
                    <div class="otp-code">${otpCode}</div>
                </div>
                
                <div class="note">
                    This code expires in 10 minutes. Don't share it with anyone.
                </div>
                
                <div class="warning">
                    ⚠️ If you didn't request a password reset, please ignore this email and your password will remain unchanged.
                </div>
                
                <div class="footer">
                    Need help? Contact our support team.<br>
                    Best regards,<br>
                    The Helperr Team
                </div>
            </div>
        </body>
        </html>
        `,
    };

    try {
       const info = await transporter.sendMail(mailOptions);
       mailLog.info(`Password reset OTP email sent to ${email}: ${info.response}`);
    } catch (error) {
        mailLog.error(`Error sending password reset email to ${email}: ${error}`);
    }
};

export const sendVerificationStatusEmail = async (
    name: string, 
    email: string, 
    status: 'APPROVED' | 'REJECTED',
    remarks?: string
) => {
    const transporter = createEmailTransporter();

    const isApproved = status === 'APPROVED';
    
    const statusConfig = {
        APPROVED: {
            subject: '✅ Identity Verification Approved - Welcome to Helperr!',
            title: 'Verification Approved!',
            emoji: '🎉',
            color: '#10b981', // green
            message: 'Congratulations! Your identity verification has been successfully approved.',
            details: 'You now have full access to all Helperr features. You can start offering your services or hiring helpers right away!',
            action: 'Get Started',
            actionColor: '#10b981'
        },
        REJECTED: {
            subject: '❌ Identity Verification Update - Action Required',
            title: 'Verification Requires Attention',
            emoji: '📋',
            color: '#ef4444', // red
            message: 'Unfortunately, we were unable to verify your identity with the information provided.',
            details: 'The documents or information submitted did not meet our verification requirements. Please review and resubmit with valid documentation.',
            action: 'Resubmit Documents',
            actionColor: '#6666ff'
        }
    };

    const config = statusConfig[status];

    const mailOptions = {
        from: `Kayode from Helperr <${EMAIL_USERNAME}>`,
        to: email,
        subject: config.subject,
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${config.title}</title>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    padding: 30px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .logo {
                    width: 200px;
                    margin: 0 auto 20px auto;
                    display: block;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .status-badge {
                    background-color: ${config.color};
                    color: white;
                    padding: 10px 20px;
                    border-radius: 20px;
                    display: inline-block;
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 20px;
                }
                .emoji {
                    font-size: 48px;
                    margin: 20px 0;
                    text-align: center;
                }
                .greeting {
                    font-size: 18px;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .message {
                    font-size: 16px;
                    line-height: 1.6;
                    margin-bottom: 20px;
                    text-align: center;
                    font-weight: 600;
                }
                .details {
                    background-color: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    font-size: 15px;
                    line-height: 1.6;
                    margin: 25px 0;
                    border-left: 4px solid ${config.color};
                }
                .remarks-box {
                    background-color: #fff3cd;
                    border: 1px solid #ffeaa7;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                }
                .remarks-title {
                    font-weight: bold;
                    margin-bottom: 8px;
                    color: #856404;
                }
                .remarks-text {
                    color: #856404;
                    font-size: 14px;
                    line-height: 1.5;
                }
                .cta-button {
                    display: inline-block;
                    background-color: ${config.actionColor};
                    color: white !important;
                    padding: 12px 30px;
                    border-radius: 5px;
                    text-decoration: none;
                    font-weight: bold;
                    margin: 20px 0;
                    text-align: center;
                }
                .button-container {
                    text-align: center;
                    margin: 30px 0;
                }
                .info-list {
                    text-align: left;
                    margin: 20px 0;
                    padding-left: 20px;
                }
                .info-list li {
                    margin: 10px 0;
                    line-height: 1.5;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    color: #666;
                    font-size: 14px;
                }
                .support-text {
                    background-color: #e7f3ff;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                    font-size: 14px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://res.cloudinary.com/dpesanzkk/image/upload/v1757285362/my-helperr-1_xxjt9m.jpg" 
                         alt="Helperr Logo" class="logo">
                    <div class="status-badge">${status}</div>
                </div>
                
                <div class="emoji">${config.emoji}</div>
                
                <div class="greeting">Hello ${name}!</div>
                
                <div class="message">
                    ${config.message}
                </div>
                
                <div class="details">
                    ${config.details}
                </div>
                
                ${!isApproved && remarks ? `
                <div class="remarks-box">
                    <div class="remarks-title">📝 Reviewer Notes:</div>
                    <div class="remarks-text">${remarks}</div>
                </div>
                ` : ''}
                
                ${isApproved ? `
                <div class="info-list">
                    <strong>What's Next?</strong>
                    <ul>
                        <li>✅ Complete your profile with your skills and services</li>
                        <li>🔍 Start browsing available jobs or post your own service</li>
                        <li>💬 Connect with clients or helpers in your area</li>
                        <li>⭐ Build your reputation with quality work</li>
                    </ul>
                </div>
                ` : `
                <div class="info-list">
                    <strong>To resubmit your verification:</strong>
                    <ul>
                        <li>📸 Ensure documents are clear and readable</li>
                        <li>✓ Verify all information matches your ID</li>
                        <li>📄 Submit valid government-issued identification</li>
                        <li>💡 Double-check all required fields are filled</li>
                    </ul>
                </div>
                `}
                
                <div class="button-container">
                    <a href="#" class="cta-button">
                        Go to App
                    </a>
                </div>
                
                <div class="support-text">
                    💡 Need help? Our support team is here for you at support@helperr.com
                </div>
                
                <div class="footer">
                    Thank you for being part of the Helperr community!<br>
                    Best regards,<br>
                    The Helperr Team
                </div>
            </div>
        </body>
        </html>
        `,
    };

    try {
       const info = await transporter.sendMail(mailOptions);
       mailLog.info(`Verification status (${status}) email sent to ${email}: ${info.response}`);
    } catch (error) {
        mailLog.error(`Error sending verification status email to ${email}: ${error}`);
    }
};