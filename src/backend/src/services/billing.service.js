const tenantRepository = require('../repositories/tenant.repository');
const { NotFoundError, ValidationError } = require('../utils/errors');
const stripe = require('../config/stripe');
const config = require('../config');
const { hasFeature, isTrialExpired } = require('../utils/helpers');
const logger = require('../utils/logger');

class BillingService {
  async getBillingInfo(tenantId) {
    const tenant = await tenantRepository.findById(tenantId);
    if (!tenant) {
      throw new NotFoundError('Tenant');
    }

    return {
      plan: tenant.plan,
      planDetails: config.plans[tenant.plan],
      trialEndsAt: tenant.trialEndsAt,
      isTrialExpired: isTrialExpired(tenant.trialEndsAt),
      stripeCustomerId: tenant.stripeCustomerId,
    };
  }

  async createBillingPortalSession(tenantId) {
    const tenant = await tenantRepository.findById(tenantId);
    if (!tenant) {
      throw new NotFoundError('Tenant');
    }

    if (!tenant.stripeCustomerId) {
      throw new ValidationError('No Stripe customer associated with this account');
    }

    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: tenant.stripeCustomerId,
        return_url: `${config.urls.frontend}/billing`,
      });

      return {
        url: session.url,
      };
    } catch (error) {
      logger.error('Stripe billing portal error:', error);
      throw new Error('Failed to create billing portal session');
    }
  }

  async checkFeatureAccess(tenantId, feature) {
    const tenant = await tenantRepository.findById(tenantId);
    if (!tenant) {
      return false;
    }

    // Check if trial is expired
    if (tenant.plan === 'trial' && isTrialExpired(tenant.trialEndsAt)) {
      return false;
    }

    return hasFeature(tenant.plan, feature);
  }
}

module.exports = new BillingService();

