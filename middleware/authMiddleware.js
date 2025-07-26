const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const verifyToken = async (req, res, next) => {
  const token = req.headers?.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded?.id)?.select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err?.message);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = verifyToken;
