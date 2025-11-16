const Dish = require('../models/Dish');

class DishRepository {
  async create(data) {
    return await Dish.create(data);
  }

  async findById(id) {
    return await Dish.findById(id);
  }

  async findByCategoryId(categoryId) {
    return await Dish.find({ categoryId, isAvailable: true })
      .sort({ displayOrder: 1 });
  }

  async findByRestaurantId(restaurantId) {
    return await Dish.find({ restaurantId, isAvailable: true })
      .sort({ displayOrder: 1 });
  }

  async findByTenantIdAndId(tenantId, id) {
    return await Dish.findOne({ _id: id, tenantId });
  }

  async findByRestaurantIdAndCategoryId(restaurantId, categoryId) {
    return await Dish.find({ restaurantId, categoryId, isAvailable: true })
      .sort({ displayOrder: 1 });
  }

  async update(id, data) {
    return await Dish.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async updateByTenantId(tenantId, id, data) {
    return await Dish.findOneAndUpdate(
      { _id: id, tenantId },
      data,
      { new: true, runValidators: true }
    );
  }

  async delete(id) {
    return await Dish.findByIdAndDelete(id);
  }

  async deleteByTenantId(tenantId, id) {
    return await Dish.findOneAndDelete({ _id: id, tenantId });
  }

  async toggleAvailability(id, isAvailable) {
    return await Dish.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true }
    );
  }
}

module.exports = new DishRepository();

