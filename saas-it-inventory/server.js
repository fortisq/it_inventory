const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const tenantMiddleware = require('./middleware/tenantMiddleware');
const errorHandler = require('./utils/errorHandler');
const { scheduleAllTasks } = require('./utils/scheduledTasks');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(tenantMiddleware);

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const assetRoutes = require('./routes/assetRoutes');
const licenseRoutes = require('./routes/licenseRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const statsRoutes = require('./routes/statsRoutes');
const softwareSubscriptionRoutes = require('./routes/softwareSubscriptionRoutes');
const healthRoutes = require('./routes/healthRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/licenses', licenseRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/software-subscriptions', softwareSubscriptionRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/reports', reportRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Start scheduled tasks
scheduleAllTasks();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
