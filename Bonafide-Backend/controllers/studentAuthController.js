const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const students = require('../model/Student');
const populateStudentDetails=require("../services/StudentDataSync");

// REGISTER STUDENT
exports.registerStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existing = await students.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Student already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await students.create({ email, password: hashedPassword });
    await populateStudentDetails(email);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    }); 

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ msg: 'Student registered and authenticated', token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// LOGIN STUDENT
exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await students.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ msg: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
