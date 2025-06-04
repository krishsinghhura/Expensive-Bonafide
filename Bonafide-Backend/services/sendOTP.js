// utils/sendOTP.js

const nodemailer = require('nodemailer');
const { setOTP } = require('./otpStore');


const sendOTP = async (email, otp) => {
  try {
    // Store the OTP (e.g., in Redis or memory)
    await setOTP(email, otp);
    console.log(`OTP ${otp} set for ${email}`);

    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Mail details
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
    
    return true;
  } catch (error) {
    console.error(`Failed to send OTP to ${email}:`, error);
    throw new Error('Error sending OTP');
  }
};

module.exports = sendOTP;
