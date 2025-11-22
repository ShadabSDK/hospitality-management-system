const initModels = require('../models');

class TenantRepository {
  constructor() {
    this.models = null;
  }

  getModels() {
    if (!this.models) {
      this.models = initModels();
    }
    return this.models;
  }

  async create(data) {
    const { Tenant } = this.getModels();
    return await Tenant.create(data);
  }

  async findById(id) {
    const { Tenant } = this.getModels();
    return await Tenant.findByPk(id);
  }

  async findByStripeCustomerId(stripeCustomerId) {
    const { Tenant } = this.getModels();
    return await Tenant.findOne({ where: { stripeCustomerId } });
  }

  async update(id, data) {
    const { Tenant } = this.getModels();
    const [updatedRowsCount] = await Tenant.update(data, { 
      where: { id },
      returning: true 
    });
    if (updatedRowsCount === 0) return null;
    return await Tenant.findByPk(id);
  }

  async updatePlan(id, plan) {
    const { Tenant } = this.getModels();
    const [updatedRowsCount] = await Tenant.update(
      { plan, trialEndsAt: null },
      { where: { id }, returning: true }
    );
    if (updatedRowsCount === 0) return null;
    return await Tenant.findByPk(id);
  }
}

module.exports = new TenantRepository();

