const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const os = require('os');
const { authMiddleware } = require('../middleware/authMiddleware');
const { version: appVersion } = require('../package.json');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    const dbStats = await mongoose.connection.db.stats();

    const healthInfo = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      app: {
        version: appVersion,
        uptime: process.uptime(),
      },
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        cpuCores: os.cpus().length,
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
      },
      database: {
        status: dbStatus,
        name: mongoose.connection.name,
        collections: dbStats.collections,
        documents: dbStats.objects,
        indexes: dbStats.indexes,
        dataSize: dbStats.dataSize,
      },
      dependencies: {
        express: require('express/package.json').version,
        mongoose: require('mongoose/package.json').version,
        nodemailer: require('nodemailer/package.json').version,
        stripe: require('stripe/package.json').version,
      },
    };

    res.json(healthInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch health information' });
  }
});

module.exports = router;
