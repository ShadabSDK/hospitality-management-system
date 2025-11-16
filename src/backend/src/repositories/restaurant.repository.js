const Restaurant = require('../models/Restaurant');

class RestaurantRepository {
  async create(data) {
    return await Restaurant.create(data);
  }

  async findById(id) {
    return await Restaurant.findById(id);
  }

  async findBySlug(slug) {
    return await Restaurant.findOne({ slug });
  }

  async findByTenantId(tenantId) {
    return await Restaurant.find({ tenantId });
  }

  async findByTenantIdAndId(tenantId, id) {
    return await Restaurant.findOne({ _id: id, tenantId });
  }

  async update(id, data) {
    return await Restaurant.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async updateByTenantId(tenantId, id, data) {
    return await Restaurant.findOneAndUpdate(
      { _id: id, tenantId },
      data,
      { new: true, runValidators: true }
    );
  }

  async delete(id) {
    return await Restaurant.findByIdAndDelete(id);
  }

  async checkSlugExists(slug, excludeId = null) {
    const query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return await Restaurant.findOne(query);
  }
}

module.exports = new RestaurantRepository();

