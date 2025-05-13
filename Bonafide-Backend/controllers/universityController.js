const University = require('../model/University');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUniversity = async (req, res) => {
  const { name, password, privateKey } = req.body;
  console.log(req.body);
  

  try {
    const existing = await University.findOne({ name });
    if (existing) return res.status(400).json({ msg: 'University already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const university = await University.create({
      name,
      password: hashedPassword,
      privateKey
    });

    const token = jwt.sign({ id: university._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Set to true in production
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ msg: 'University registered and authenticated' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
