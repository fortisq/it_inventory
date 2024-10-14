const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const authMiddleware = async (req, res, next) => {
  logger.info('Auth middleware called');
  logger.info('Headers:', req.headers);

  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    logger.info('Token:', token);

    if (!token) {
      logger.warn('No token provided');
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.info('Decoded token:', decoded);

    const user = await User.findOne({ _id: decoded.userId });
    logger.info('User found:', user);

    if (!user) {
      logger.warn('User not found');
      throw new Error('User not found');
    }

    req.token = token;
    req.user = {
      userId: user._id,
      username: user.username,
      role: user.role
    };
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
