
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const student = require('../models/student');

exports.registerStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existing = await student.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Student already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await student.create({ email, password: hashedPassword });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ msg: 'Student registered and authenticated' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
