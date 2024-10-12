/**
 * SaaS IT Inventory Application - Authentication Middleware
 * 
 * Copyright (c) 2024 Dan Bressers, NIT Solutions Ltd
 * 
 * This file is part of the SaaS IT Inventory Application.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId, tenant: req.tenant._id });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = authMiddleware;
