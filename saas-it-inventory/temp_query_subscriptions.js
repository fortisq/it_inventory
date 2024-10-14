const mongoose = require('mongoose');
const Subscription = require('./models/Subscription');

mongoose.connect('mongodb://localhost:27017/it_inventory', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  try {
    const subscriptions = await Subscription.find({});
    console.log(JSON.stringify(subscriptions, null, 2));
  } catch (error) {
    console.error('Error querying subscriptions:', error);
  } finally {
    mongoose.connection.close();
  }
})
.catch(error => console.error('Error connecting to MongoDB:', error));
