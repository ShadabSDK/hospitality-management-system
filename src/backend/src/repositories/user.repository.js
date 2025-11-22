const initModels = require('../models');

class UserRepository {
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
    const { AdminUser } = this.getModels();
    return await AdminUser.create(data);
  }

  async findById(id) {
    const { AdminUser } = this.getModels();
    return await AdminUser.findByPk(id);
  }

  async findByEmail(email) {
    const { AdminUser } = this.getModels();
    return await AdminUser.findOne({ where: { email: email.toLowerCase() } });
  }

  async findByEmailAndTenant(email, tenantId) {
    const { AdminUser } = this.getModels();
    return await AdminUser.findOne({ 
      where: { 
        email: email.toLowerCase(), 
        tenantId 
      }
    });
  }

  async findByTenantId(tenantId) {
    const { AdminUser } = this.getModels();
    return await AdminUser.findAll({ where: { tenantId } });
  }

  async update(id, data) {
    const { AdminUser } = this.getModels();
    const [updatedRowsCount] = await AdminUser.update(data, { 
      where: { id },
      returning: true 
    });
    if (updatedRowsCount === 0) return null;
    return await AdminUser.findByPk(id);
  }

  async updateLastLogin(id) {
    const { AdminUser } = this.getModels();
    return await AdminUser.update(
      { lastLogin: new Date() },
      { where: { id } }
    );
  }

  async delete(id) {
    const { AdminUser } = this.getModels();
    return await AdminUser.destroy({ where: { id } });
  }
}

module.exports = new UserRepository();

