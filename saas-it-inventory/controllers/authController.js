const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { errorHandler } = require('../utils/errorHandler');

exports.login = async (req, res) => {
  try {
    console.log("Login attempt received:", req.body);
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found:", username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    console.log("User found:", user);

    // Check password
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const isMatch = hashedPassword === user.password;
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("Password mismatch for user:", username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log("Login successful for user:", username);
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
    console.error("Login error:", error);
    errorHandler(error, req, res);
  }
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || 'user'
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
    const { firstName, lastName, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { firstName, lastName, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    errorHandler(error, req, res);
  }
};
