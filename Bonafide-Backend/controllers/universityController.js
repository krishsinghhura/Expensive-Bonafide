const University = require('../model/University');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { setOTP, getOTP, deleteOTP } = require('../services/otpStore');
const nodemailer = require('nodemailer');
const sendOTP = require('../services/sendOTP');

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const record = getOTP(email);
  if (!record) return res.status(400).json({ msg: 'No OTP found. Request again.' });

  if (record.otp !== otp) return res.status(400).json({ msg: 'Invalid OTP' });

  if (Date.now() > record.expiresAt) {
    deleteOTP(email);
    return res.status(400).json({ msg: 'OTP expired' });
  }

  deleteOTP(email);
  res.status(200).json({ msg: 'OTP verified' });
};


exports.registerUniversity = async (req, res) => {
  
  const { name, email , password, privateKey } = req.body;
  
  try {
    const existing = await University.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'University already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    const university = await University.create({
      name,
      email,
      password: hashedPassword,
      privateKey,
      isVerified: false,
      otp,
      otpExpires,
    });
    
    await sendOTP(email,otp);

    res.status(201).json({ msg: 'OTP sent to university email. Please verify to complete registration.' , University : university });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const university = await University.findOne({ email });

    if (!university) return res.status(400).json({ msg: 'University not found' });
    if (university.isVerified) return res.status(400).json({ msg: 'University already verified' });

    // FIXED: String === String and Date comparison
    if (university.otp !== otp || university.otpExpires < new Date()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    university.isVerified = true;
    university.otp = undefined;
    university.otpExpires = undefined;

    await university.save();

    const token = jwt.sign({ id: university._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ msg: 'University verified and logged in', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.loginUniversity = async (req, res) => {
  const { email, password } = req.body;

  try {
    const university = await University.findOne({ email });
    if (!university) return res.status(400).json({ msg: 'University not found' });

    const isMatch = await bcrypt.compare(password, university.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: university._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Set to true in production
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ msg: 'University logged in successfully', token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
