const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const assetRoutes = require('./routes/assetRoutes');
const licenseRoutes = require('./routes/licenseRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const softwareSubscriptionRoutes = require('./routes/softwareSubscriptionRoutes');
const healthRoutes = require('./routes/healthRoutes');
const reportRoutes = require('./routes/reportRoutes');
const helpRoutes = require('./routes/helpRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const { createSuperAdmin } = require('./utils/createSuperAdmin');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/licenses', licenseRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/software-subscriptions', softwareSubscriptionRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/help', helpRoutes);
app.use('/api/inventory', inventoryRoutes);

// Create super admin
createSuperAdmin();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).send("Sorry, that route doesn't exist.");
});

module.exports = app;
