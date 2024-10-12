import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { getSubscription, createCheckoutSession, getInvoiceHistory, getPaymentMethods } from '../services/api';
import './SubscriptionManagement.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const SubscriptionManagement = () => {
  const [subscription, setSubscription] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const fetchData = async () => {
    try {
      const [subData, invoiceData, paymentData] = await Promise.all([
        getSubscription(),
        getInvoiceHistory(),
        getPaymentMethods()
      ]);
      setSubscription(subData);
      setInvoices(invoiceData);
      setPaymentMethods(paymentData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch subscription data');
      setLoading(false);
    }
  };

  const handleStripeRedirect = useCallback(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('success')) {
      setError(null);
      fetchData();
    } else if (query.get('canceled')) {
      setError('Subscription update was canceled.');
    }
  }, [location.search]);

  useEffect(() => {
    fetchData();
    handleStripeRedirect();
  }, [handleStripeRedirect]);

  const handleUpgrade = async (newPlan) => {
    try {
      const { sessionId } = await createCheckoutSession(newPlan);
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      setError('Failed to initiate subscription upgrade');
    }
  };

  const getPlanDetails = (planName) => {
    const plans = {
      basic: { name: 'Basic Plan', price: '$9.99/month', features: ['Up to 100 items', 'Up to 5 users', 'Basic support'] },
      pro: { name: 'Pro Plan', price: '$19.99/month', features: ['Up to 1000 items', 'Up to 20 users', 'Priority support', 'Advanced analytics'] },
      enterprise: { name: 'Enterprise Plan', price: '$49.99/month', features: ['Unlimited items', 'Unlimited users', '24/7 support', 'Custom integrations'] }
    };
    return plans[planName];
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="subscription-management">
      <h2>Subscription Management</h2>
      {subscription && (
        <div className="current-plan">
          <h3>Current Plan: {getPlanDetails(subscription.plan).name}</h3>
          <p>Status: {subscription.status}</p>
          <p>Next billing date: {new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
          <div className="usage-info">
            <h4>Current Usage:</h4>
            <p>Users: {subscription.usage.users.current} / {subscription.usage.users.limit}</p>
            <p>Assets: {subscription.usage.assets.current} / {subscription.usage.assets.limit}</p>
          </div>
        </div>
      )}
      <div className="plan-options">
        {['basic', 'pro', 'enterprise'].map((planName) => {
          const plan = getPlanDetails(planName);
          return (
            <div key={planName} className="plan">
              <h3>{plan.name}</h3>
              <p className="price">{plan.price}</p>
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button 
                onClick={() => handleUpgrade(planName)} 
                disabled={subscription?.plan === planName || subscription?.status === 'cancelled'}
              >
                {subscription?.plan === planName ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          );
        })}
      </div>
      {subscription?.status !== 'cancelled' && (
        <div className="cancel-subscription">
          <button onClick={() => handleUpgrade('cancel')} className="cancel-button">
            Cancel Subscription
          </button>
        </div>
      )}
      <div className="invoice-history">
        <h3>Invoice History</h3>
        {invoices.length > 0 ? (
          <ul>
            {invoices.map((invoice) => (
              <li key={invoice.id}>
                Date: {new Date(invoice.created * 1000).toLocaleDateString()} - 
                Amount: ${(invoice.amount_paid / 100).toFixed(2)} - 
                Status: {invoice.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>No invoices found.</p>
        )}
      </div>
      <div className="payment-methods">
        <h3>Payment Methods</h3>
        {paymentMethods.length > 0 ? (
          <ul>
            {paymentMethods.map((method) => (
              <li key={method.id}>
                {method.card.brand} ending in {method.card.last4} - 
                Expires: {method.card.exp_month}/{method.card.exp_year}
              </li>
            ))}
          </ul>
        ) : (
          <p>No payment methods found.</p>
        )}
      </div>
    </div>
  );
};

export default SubscriptionManagement;
