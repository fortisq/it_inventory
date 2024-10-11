const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {
  sendSubscriptionChangeNotification,
  sendApproachingLimitNotification,
} = require('../utils/emailService');

// Get current subscription and usage
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.user.tenantId);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    res.json({
      plan: tenant.subscriptionPlan,
      status: tenant.subscriptionStatus,
      nextBillingDate: tenant.nextBillingDate,
      usage: {
        users: {
          current: tenant.userCount,
          limit: tenant.userLimit
        },
        assets: {
          current: tenant.assetCount,
          limit: tenant.assetLimit
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscription', error: error.message });
  }
});

// Create a checkout session for subscription
router.post('/create-checkout-session', authMiddleware, async (req, res) => {
  const { plan } = req.body;
  const tenant = await Tenant.findById(req.user.tenantId);

  if (!tenant) {
    return res.status(404).json({ message: 'Tenant not found' });
  }

  const prices = {
    basic: process.env.STRIPE_BASIC_PRICE_ID,
    pro: process.env.STRIPE_PRO_PRICE_ID,
    enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID
  };

  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: req.user.email,
      client_reference_id: tenant._id.toString(),
      payment_method_types: ['card'],
      line_items: [
        {
          price: prices[plan],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/subscription?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription?canceled=true`,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating checkout session', error: error.message });
  }
});

// Get invoice history
router.get('/invoices', authMiddleware, async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.user.tenantId);
    if (!tenant || !tenant.stripeCustomerId) {
      return res.status(404).json({ message: 'Tenant or Stripe customer not found' });
    }

    const invoices = await stripe.invoices.list({
      customer: tenant.stripeCustomerId,
      limit: 10,
    });

    res.json(invoices.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoice history', error: error.message });
  }
});

// Get payment methods
router.get('/payment-methods', authMiddleware, async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.user.tenantId);
    if (!tenant || !tenant.stripeCustomerId) {
      return res.status(404).json({ message: 'Tenant or Stripe customer not found' });
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: tenant.stripeCustomerId,
      type: 'card',
    });

    res.json(paymentMethods.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment methods', error: error.message });
  }
});

// Handle Stripe webhook
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      const tenantId = subscription.client_reference_id;
      const tenant = await Tenant.findById(tenantId);

      if (tenant) {
        const oldPlan = tenant.subscriptionPlan;
        tenant.subscriptionPlan = subscription.status === 'active' ? subscription.items.data[0].price.nickname : 'canceled';
        tenant.subscriptionStatus = subscription.status;
        tenant.nextBillingDate = new Date(subscription.current_period_end * 1000);
        await tenant.save();

        // Send email notification for subscription change
        const adminUser = await User.findOne({ tenantId: tenant._id, role: 'admin' });
        if (adminUser) {
          await sendSubscriptionChangeNotification(adminUser.email, tenant.subscriptionPlan);
        }

        // Check and send notifications for approaching limits
        if (tenant.userCount >= tenant.userLimit * 0.8) {
          await sendApproachingLimitNotification(adminUser.email, 'user', tenant.userCount, tenant.userLimit);
        }
        if (tenant.assetCount >= tenant.assetLimit * 0.8) {
          await sendApproachingLimitNotification(adminUser.email, 'asset', tenant.assetCount, tenant.assetLimit);
        }
      }
      break;
    case 'customer.created':
      const customer = event.data.object;
      const newTenant = await Tenant.findById(customer.client_reference_id);
      if (newTenant) {
        newTenant.stripeCustomerId = customer.id;
        await newTenant.save();
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

module.exports = router;
