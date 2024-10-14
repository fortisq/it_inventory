const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const winston = require('winston');
const fs = require('fs');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const userRoutes = require('./routes/userRoutes');
const configurationRoutes = require('./routes/configurationRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const assetRoutes = require('./routes/assetRoutes');
const softwareSubscriptionRoutes = require('./routes/softwareSubscriptionRoutes');
const reportRoutes = require('./routes/reportRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const configurationController = require('./controllers/configurationController');
const tenantService = require('./services/tenantService');

dotenv.config();

// Configure winston logger
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Capture console.log and console.error
console.log = (...args) => logger.info(args.join(' '));
console.error = (...args) => logger.error(args.join(' '));

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

logger.info('Attempting to connect to MongoDB...');
logger.info('MongoDB URI:', process.env.MONGODB_URI); // Log the MongoDB URI

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  logger.info('Connected to MongoDB');
  logger.info('Loading Asset model...');
  const Asset = require('./models/Asset');
  logger.info('Asset model loaded');
  
  // Remove subdomain index
  await tenantService.removeSubdomainIndex();
  logger.info('Subdomain index removed (if it existed)');

  // Initialize default configurations
  await configurationController.initializeDefaultConfigurations();
  logger.info('Default configurations initialized');
})
.catch((err) => {
  logger.error('MongoDB connection error:', err);
  process.exit(1); // Exit the process if unable to connect to MongoDB
});

app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/configuration', configurationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/tenants', tenantRoutes);

// Add logging for asset routes
app.use('/api/assets', (req, res, next) => {
  if (req.method === 'POST') {
    logger.info('Attempting to create new asset');
    logger.info('Asset data:', JSON.stringify(req.body, null, 2));
  }
  next();
}, assetRoutes);

app.use('/api/software-subscriptions', softwareSubscriptionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error:', err.message);
  logger.error('Stack:', err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});
