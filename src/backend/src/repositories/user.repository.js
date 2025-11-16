const AdminUser = require('../models/AdminUser');

class UserRepository {
  async create(data) {
    return await AdminUser.create(data);
  }

  async findById(id) {
    return await AdminUser.findById(id).select('+password');
  }

  async findByEmail(email) {
    return await AdminUser.findOne({ email: email.toLowerCase() }).select('+password');
  }

  async findByEmailAndTenant(email, tenantId) {
    return await AdminUser.findOne({ 
      email: email.toLowerCase(), 
      tenantId 
    }).select('+password');
  }

  async findByTenantId(tenantId) {
    return await AdminUser.find({ tenantId });
  }

  async update(id, data) {
    return await AdminUser.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async updateLastLogin(id) {
    return await AdminUser.findByIdAndUpdate(id, { lastLogin: new Date() });
  }

  async delete(id) {
    return await AdminUser.findByIdAndDelete(id);
  }
}

module.exports = new UserRepository();

