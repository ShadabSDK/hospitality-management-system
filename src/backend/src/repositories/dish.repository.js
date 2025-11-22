const initModels = require('../models');

class DishRepository {
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
    const { Dish } = this.getModels();
    return await Dish.create(data);
  }

  async findById(id) {
    const { Dish } = this.getModels();
    return await Dish.findByPk(id);
  }

  async findByCategoryId(categoryId) {
    const { Dish } = this.getModels();
    return await Dish.findAll({ 
      where: { categoryId, isAvailable: true },
      order: [['displayOrder', 'ASC']]
    });
  }

  async findByRestaurantId(restaurantId) {
    const { Dish } = this.getModels();
    return await Dish.findAll({ 
      where: { restaurantId, isAvailable: true },
      order: [['displayOrder', 'ASC']]
    });
  }

  async findByTenantIdAndId(tenantId, id) {
    const { Dish } = this.getModels();
    return await Dish.findOne({ where: { id, tenantId } });
  }

  async findByRestaurantIdAndCategoryId(restaurantId, categoryId) {
    const { Dish } = this.getModels();
    return await Dish.findAll({ 
      where: { restaurantId, categoryId, isAvailable: true },
      order: [['displayOrder', 'ASC']]
    });
  }

  async update(id, data) {
    const { Dish } = this.getModels();
    const [updatedRowsCount] = await Dish.update(data, { 
      where: { id },
      returning: true 
    });
    if (updatedRowsCount === 0) return null;
    return await Dish.findByPk(id);
  }

  async updateByTenantId(tenantId, id, data) {
    const { Dish } = this.getModels();
    const [updatedRowsCount] = await Dish.update(data, { 
      where: { id, tenantId },
      returning: true 
    });
    if (updatedRowsCount === 0) return null;
    return await Dish.findByPk(id);
  }

  async delete(id) {
    const { Dish } = this.getModels();
    return await Dish.destroy({ where: { id } });
  }

  async deleteByTenantId(tenantId, id) {
    const { Dish } = this.getModels();
    return await Dish.destroy({ where: { id, tenantId } });
  }

  async toggleAvailability(id, isAvailable) {
    const { Dish } = this.getModels();
    const [updatedRowsCount] = await Dish.update(
      { isAvailable },
      { where: { id }, returning: true }
    );
    if (updatedRowsCount === 0) return null;
    return await Dish.findByPk(id);
  }
}

module.exports = new DishRepository();

