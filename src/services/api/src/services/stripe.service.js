/**
 * Stripe Service
 * Handles Stripe billing operations
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tenant = require('../models/Tenant');

exports.createCustomer = async (email, tenantName) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name: tenantName
    });
    return customer;
  } catch (error) {
    throw new Error(`Stripe customer creation failed: ${error.message}`);
  }
};

exports.createSubscription = async (customerId, priceId) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      trial_period_days: 14
    });
    return subscription;
  } catch (error) {
    throw new Error(`Stripe subscription creation failed: ${error.message}`);
  }
};

exports.updateSubscription = async (subscriptionId, priceId) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: priceId
        }
      ]
    });
    return updatedSubscription;
  } catch (error) {
    throw new Error(`Stripe subscription update failed: ${error.message}`);
  }
};

exports.getBillingPortalUrl = async (customerId, returnUrl) => {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl
    });
    return session.url;
  } catch (error) {
    throw new Error(`Billing portal session failed: ${error.message}`);
  }
};

exports.handleWebhook = async (event) => {
  switch (event.type) {
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
  }
};

const handleSubscriptionUpdate = async (subscription) => {
  try {
    await Tenant.updateOne(
      { stripeCustomerId: subscription.customer },
      {
        stripeSubscriptionId: subscription.id,
        plan: subscription.metadata?.plan || 'basic'
      }
    );
  } catch (error) {
    console.error('Subscription update handling failed:', error);
  }
};

const handleSubscriptionDeleted = async (subscription) => {
  try {
    await Tenant.updateOne(
      { stripeCustomerId: subscription.customer },
      {
        stripeSubscriptionId: null,
        plan: 'free',
        isActive: false
      }
    );
  } catch (error) {
    console.error('Subscription deletion handling failed:', error);
  }
};
