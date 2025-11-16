const stripe = require('stripe');
const config = require('./index');

if (!config.stripe.secretKey) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

const stripeClient = stripe(config.stripe.secretKey);

module.exports = stripeClient;

