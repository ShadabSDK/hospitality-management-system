const dishRepository = require('../repositories/dish.repository');
const categoryRepository = require('../repositories/category.repository');
const restaurantRepository = require('../repositories/restaurant.repository');
const { NotFoundError, ValidationError } = require('../utils/errors');
const { validatePrice } = require('../utils/validators');
const { invalidateMenuCache } = require('../utils/cache');

class DishService {
  async createDish(tenantId, restaurantId, data) {
    // Verify restaurant belongs to tenant
    const restaurant = await restaurantRepository.findByTenantIdAndId(tenantId, restaurantId);
    if (!restaurant) {
      throw new NotFoundError('Restaurant');
    }

    // Verify category belongs to restaurant and tenant
    const category = await categoryRepository.findByTenantIdAndId(tenantId, data.categoryId);
    if (!category || category.restaurantId.toString() !== restaurantId) {
      throw new NotFoundError('Category');
    }

    // Validate price
    if (data.price) {
      validatePrice(data.price);
    }

    const dish = await dishRepository.create({
      ...data,
      restaurantId,
      tenantId,
    });

    // Invalidate menu cache
    await invalidateMenuCache(restaurant.slug);

    return dish;
  }

  async updateDish(tenantId, dishId, data) {
    const dish = await dishRepository.findByTenantIdAndId(tenantId, dishId);
    if (!dish) {
      throw new NotFoundError('Dish');
    }

    // Validate price if provided
    if (data.price) {
      validatePrice(data.price);
    }

    // If category is being updated, verify it belongs to same restaurant
    if (data.categoryId) {
      const category = await categoryRepository.findByTenantIdAndId(tenantId, data.categoryId);
      if (!category || category.restaurantId.toString() !== dish.restaurantId.toString()) {
        throw new ValidationError('Category does not belong to this restaurant');
      }
    }

    const updated = await dishRepository.updateByTenantId(tenantId, dishId, data);

    // Get restaurant to invalidate cache
    const restaurant = await restaurantRepository.findById(dish.restaurantId);
    if (restaurant) {
      await invalidateMenuCache(restaurant.slug);
    }

    return updated;
  }

  async deleteDish(tenantId, dishId) {
    const dish = await dishRepository.findByTenantIdAndId(tenantId, dishId);
    if (!dish) {
      throw new NotFoundError('Dish');
    }

    const restaurant = await restaurantRepository.findById(dish.restaurantId);
    await dishRepository.deleteByTenantId(tenantId, dishId);

    // Invalidate menu cache
    if (restaurant) {
      await invalidateMenuCache(restaurant.slug);
    }

    return { message: 'Dish deleted successfully' };
  }

  async toggleAvailability(tenantId, dishId, isAvailable) {
    const dish = await dishRepository.findByTenantIdAndId(tenantId, dishId);
    if (!dish) {
      throw new NotFoundError('Dish');
    }

    const updated = await dishRepository.toggleAvailability(dishId, isAvailable);

    // Invalidate menu cache
    const restaurant = await restaurantRepository.findById(dish.restaurantId);
    if (restaurant) {
      await invalidateMenuCache(restaurant.slug);
    }

    return updated;
  }
}

module.exports = new DishService();

