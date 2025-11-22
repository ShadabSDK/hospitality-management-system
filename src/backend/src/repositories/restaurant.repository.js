const initModels = require('../models');
const { Op } = require('sequelize');

class RestaurantRepository {
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
    const { Restaurant } = this.getModels();
    return await Restaurant.create(data);
  }

  async findById(id) {
    const { Restaurant } = this.getModels();
    return await Restaurant.findByPk(id);
  }

  async findBySlug(slug) {
    const { Restaurant } = this.getModels();
    return await Restaurant.findOne({ where: { slug } });
  }

  async findByTenantId(tenantId) {
    const { Restaurant } = this.getModels();
    return await Restaurant.findAll({ where: { tenantId } });
  }

  async findByTenantIdAndId(tenantId, id) {
    const { Restaurant } = this.getModels();
    return await Restaurant.findOne({ where: { id, tenantId } });
  }

  async update(id, data) {
    const { Restaurant } = this.getModels();
    const [updatedRowsCount] = await Restaurant.update(data, { 
      where: { id },
      returning: true 
    });
    if (updatedRowsCount === 0) return null;
    return await Restaurant.findByPk(id);
  }

  async updateByTenantId(tenantId, id, data) {
    const { Restaurant } = this.getModels();
    const [updatedRowsCount] = await Restaurant.update(data, { 
      where: { id, tenantId },
      returning: true 
    });
    if (updatedRowsCount === 0) return null;
    return await Restaurant.findByPk(id);
  }

  async delete(id) {
    const { Restaurant } = this.getModels();
    return await Restaurant.destroy({ where: { id } });
  }

  async checkSlugExists(slug, excludeId = null) {
    const { Restaurant } = this.getModels();
    const where = { slug };
    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }
    return await Restaurant.findOne({ where });
  }
}

module.exports = new RestaurantRepository();

