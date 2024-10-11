const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { scheduleRenewalNotifications } = require('./utils/scheduledTasks');
const { errorHandler, logger } = require('./utils/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('Could not connect to MongoDB', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const assetRoutes = require('./routes/assetRoutes');
const licenseRoutes = require('./routes/licenseRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const userRoutes = require('./routes/userRoutes');
const statsRoutes = require('./routes/statsRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const softwareSubscriptionRoutes = require('./routes/softwareSubscriptionRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/licenses', licenseRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/software-subscriptions', softwareSubscriptionRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  
  // Start scheduled tasks
  scheduleRenewalNotifications();
  logger.info('Scheduled tasks initialized');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  // In a production environment, you might want to do more than just log
  // For example, you might want to notify your error tracking service
  // or gracefully shut down your server
});
