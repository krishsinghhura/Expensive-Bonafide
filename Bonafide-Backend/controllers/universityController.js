const University = require('../model/University');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUniversity = async (req, res) => {
  const { email,name, password, privateKey } = req.body;  

  try {
    const existing = await University.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'University already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const university = await University.create({
      name,
      email,
      password: hashedPassword,
      privateKey
    });
    
    const token = jwt.sign({ id: university._id }, "supersecretkey", {
      expiresIn: '1d',
    });
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Set to true in production
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ msg: 'University registered and authenticated',token });
  } catch (err) {
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

    res.status(200).json({ msg: 'University logged in successfully',token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
