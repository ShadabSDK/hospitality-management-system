const categoryRepository = require('../repositories/category.repository');
const restaurantRepository = require('../repositories/restaurant.repository');
const { NotFoundError, TenantIsolationError } = require('../utils/errors');

class CategoryService {
  async createCategory(tenantId, restaurantId, data) {
    // Verify restaurant belongs to tenant
    const restaurant = await restaurantRepository.findByTenantIdAndId(tenantId, restaurantId);
    if (!restaurant) {
      throw new NotFoundError('Restaurant');
    }

    return await categoryRepository.create({
      ...data,
      restaurantId,
      tenantId,
    });
  }

  async getCategories(tenantId, restaurantId) {
    // Verify restaurant belongs to tenant
    const restaurant = await restaurantRepository.findByTenantIdAndId(tenantId, restaurantId);
    if (!restaurant) {
      throw new NotFoundError('Restaurant');
    }

    return await categoryRepository.findByRestaurantIdAndTenantId(restaurantId, tenantId);
  }

  async updateCategory(tenantId, categoryId, data) {
    const category = await categoryRepository.findByTenantIdAndId(tenantId, categoryId);
    if (!category) {
      throw new NotFoundError('Category');
    }

    return await categoryRepository.updateByTenantId(tenantId, categoryId, data);
  }

  async deleteCategory(tenantId, categoryId) {
    const category = await categoryRepository.findByTenantIdAndId(tenantId, categoryId);
    if (!category) {
      throw new NotFoundError('Category');
    }

    return await categoryRepository.deleteByTenantId(tenantId, categoryId);
  }
}

module.exports = new CategoryService();

