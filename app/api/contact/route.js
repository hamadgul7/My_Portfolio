import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// HTML email template
const generateEmailTemplate = (name, email, userMessage) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #007BFF;">New Message Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; margin-left: 0;">
        ${userMessage}
      </blockquote>
      <p style="font-size: 12px; color: #888;">Click reply to respond to the sender.</p>
    </div>
  </div>
`;

// Helper function to send an email via Nodemailer
async function sendEmail(payload, message) {
  const { name, email, message: userMessage } = payload;

  // Validate environment variables
  if (!process.env.EMAIL_ADDRESS || !process.env.GMAIL_PASSKEY) {
    console.error('Missing environment variables:', {
      EMAIL_ADDRESS: !!process.env.EMAIL_ADDRESS,
      GMAIL_PASSKEY: !!process.env.GMAIL_PASSKEY,
    });
    throw new Error('Email configuration is incomplete. Please check environment variables.');
  }

  // Create transporter inside function for serverless environment
  // This ensures fresh connection for each request
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.GMAIL_PASSKEY,
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 30000, // 30 seconds for serverless
    greetingTimeout: 30000,
    socketTimeout: 30000,
  });

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_ADDRESS}>`,
    to: process.env.EMAIL_ADDRESS,
    subject: `New Message From ${name}`,
    text: message,
    html: generateEmailTemplate(name, email, userMessage),
    replyTo: email,
  };

  try {
    // Verify connection before sending
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error while sending email:', {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack,
    });
    throw error;
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const { name, email, message: userMessage } = payload;

    // Validate request payload
    if (!name || !email || !userMessage) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: name, email, or message.',
      }, { status: 400 });
    }

    const message = `New message from ${name}\n\nEmail: ${email}\n\nMessage:\n\n${userMessage}\n\n`;

    console.log('Processing contact form submission from:', email);

    // Send email
    const result = await sendEmail(payload, message);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
    }, { status: 200 });

  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
    });

    // Return user-friendly error message
    const errorMessage = error.message.includes('environment variables')
      ? 'Email service is not configured properly. Please contact the administrator.'
      : 'Failed to send message. Please try again later or contact via email directly.';

    return NextResponse.json({
      success: false,
      message: errorMessage,
    }, { status: 500 });
  }
}
