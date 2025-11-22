const initModels = require('../models');

class CategoryRepository {
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
    const { Category } = this.getModels();
    return await Category.create(data);
  }

  async findById(id) {
    const { Category } = this.getModels();
    return await Category.findByPk(id);
  }

  async findByRestaurantId(restaurantId) {
    const { Category } = this.getModels();
    return await Category.findAll({ 
      where: { restaurantId, isActive: true },
      order: [['displayOrder', 'ASC']]
    });
  }

  async findByTenantIdAndId(tenantId, id) {
    const { Category } = this.getModels();
    return await Category.findOne({ where: { id, tenantId } });
  }

  async findByRestaurantIdAndTenantId(restaurantId, tenantId) {
    const { Category } = this.getModels();
    return await Category.findAll({ 
      where: { restaurantId, tenantId, isActive: true },
      order: [['displayOrder', 'ASC']]
    });
  }

  async update(id, data) {
    const { Category } = this.getModels();
    const [updatedRowsCount] = await Category.update(data, { 
      where: { id },
      returning: true 
    });
    if (updatedRowsCount === 0) return null;
    return await Category.findByPk(id);
  }

  async updateByTenantId(tenantId, id, data) {
    const { Category } = this.getModels();
    const [updatedRowsCount] = await Category.update(data, { 
      where: { id, tenantId },
      returning: true 
    });
    if (updatedRowsCount === 0) return null;
    return await Category.findByPk(id);
  }

  async delete(id) {
    const { Category } = this.getModels();
    return await Category.destroy({ where: { id } });
  }

  async deleteByTenantId(tenantId, id) {
    const { Category } = this.getModels();
    return await Category.destroy({ where: { id, tenantId } });
  }
}

module.exports = new CategoryRepository();

