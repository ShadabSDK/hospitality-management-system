const Tenant = require('../models/Tenant');

class TenantRepository {
  async create(data) {
    return await Tenant.create(data);
  }

  async findById(id) {
    return await Tenant.findById(id);
  }

  async findByStripeCustomerId(stripeCustomerId) {
    return await Tenant.findOne({ stripeCustomerId });
  }

  async update(id, data) {
    return await Tenant.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async updatePlan(id, plan) {
    return await Tenant.findByIdAndUpdate(
      id,
      { plan, trialEndsAt: null },
      { new: true }
    );
  }
}

module.exports = new TenantRepository();

