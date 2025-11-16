const Category = require('../models/Category');

class CategoryRepository {
  async create(data) {
    return await Category.create(data);
  }

  async findById(id) {
    return await Category.findById(id);
  }

  async findByRestaurantId(restaurantId) {
    return await Category.find({ restaurantId, isActive: true })
      .sort({ displayOrder: 1 });
  }

  async findByTenantIdAndId(tenantId, id) {
    return await Category.findOne({ _id: id, tenantId });
  }

  async findByRestaurantIdAndTenantId(restaurantId, tenantId) {
    return await Category.find({ restaurantId, tenantId, isActive: true })
      .sort({ displayOrder: 1 });
  }

  async update(id, data) {
    return await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async updateByTenantId(tenantId, id, data) {
    return await Category.findOneAndUpdate(
      { _id: id, tenantId },
      data,
      { new: true, runValidators: true }
    );
  }

  async delete(id) {
    return await Category.findByIdAndDelete(id);
  }

  async deleteByTenantId(tenantId, id) {
    return await Category.findOneAndDelete({ _id: id, tenantId });
  }
}

module.exports = new CategoryRepository();

