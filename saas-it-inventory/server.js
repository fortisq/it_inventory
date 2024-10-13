const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const tenantMiddleware = require('./middleware/tenantMiddleware');
const { errorHandler } = require('./utils/errorHandler');
const { scheduleAllTasks } = require('./utils/scheduledTasks');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

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
const helpRoutes = require('./routes/helpRoutes');

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
app.use('/api/help', helpRoutes);

// Error handling middleware
app.use(errorHandler);

// Function to create default super admin
async function createDefaultSuperAdmin() {
  try {
    console.log('Checking for existing super admin...');
    let superAdmin = await User.findOne({ username: 'root' });
    const plainPassword = 'root';

    if (!superAdmin) {
      console.log('No existing super admin found. Creating one...');
      superAdmin = new User({
        username: 'root',
        password: plainPassword,
        email: 'admin@example.com',
        role: 'superadmin',
        firstName: 'Super',
        lastName: 'Admin'
      });
    } else {
      console.log('Existing super admin found. Updating password...');
      superAdmin.password = plainPassword;
    }

    await superAdmin.save();
    console.log('Super admin created/updated successfully');

    // Verify the password
    const updatedAdmin = await User.findOne({ username: 'root' });
    const isPasswordCorrect = await updatedAdmin.comparePassword(plainPassword);
    console.log('Is password correct after update:', isPasswordCorrect);
  } catch (error) {
    console.error('Error creating/updating default super admin:', error);
  }
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  createDefaultSuperAdmin();
})
.catch((err) => console.error('MongoDB connection error:', err));

// Start scheduled tasks
scheduleAllTasks();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
