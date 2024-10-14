const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { errorHandler } = require('../utils/errorHandler');
const logger = require('../utils/logger');

exports.login = async (req, res) => {
  try {
    logger.info("Login attempt received:", req.body);
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      logger.info("User not found:", username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    logger.info("User found:", user);

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    logger.info("Password match:", isMatch);

    if (!isMatch) {
      logger.info("Password mismatch for user:", username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    logger.info("Login successful for user:", username);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    logger.error("Login error:", error);
    errorHandler(error, req, res);
  }
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'user' // Default role
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    logger.info('Received profile update request');
    logger.info('Request body:', JSON.stringify(req.body, null, 2));
    logger.info('User ID from token:', req.user.userId);
    logger.info('Username from token:', req.user.username);

    const user = await User.findOne({ username: req.user.username });
    
    if (!user) {
      logger.warn('User not found for profile update');
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info('User before update:', user);

    const { firstName, lastName, email, jobTitle, department } = req.body;

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (jobTitle) user.jobTitle = jobTitle;
    if (department) user.department = department;

    // Save the updated user
    await user.save();

    logger.info('Profile updated successfully');
    logger.info('Updated user:', user);

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        jobTitle: user.jobTitle,
        department: user.department
      }
    });
  } catch (error) {
    logger.error('Error updating profile:', error);
    errorHandler(error, req, res);
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports = exports;
