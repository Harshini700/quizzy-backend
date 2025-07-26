const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const register = async (req, res) => {
  try {
    const { name, email, password } = req?.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req?.body || {};

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user?._id },
      process?.env?.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
        phone: user?.phone
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

module.exports = { register, login };
