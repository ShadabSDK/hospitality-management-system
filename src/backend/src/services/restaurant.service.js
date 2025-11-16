const restaurantRepository = require('../repositories/restaurant.repository');
const { NotFoundError, ValidationError, TenantIsolationError } = require('../utils/errors');
const { validateSlug } = require('../utils/validators');
const { invalidateRestaurantCache, cacheRestaurant } = require('../utils/cache');

class RestaurantService {
  async getRestaurant(tenantId, restaurantId) {
    const restaurant = await restaurantRepository.findByTenantIdAndId(tenantId, restaurantId);
    if (!restaurant) {
      throw new NotFoundError('Restaurant');
    }
    return restaurant;
  }

  async updateRestaurant(tenantId, restaurantId, data) {
    // Verify tenant ownership
    const restaurant = await restaurantRepository.findByTenantIdAndId(tenantId, restaurantId);
    if (!restaurant) {
      throw new NotFoundError('Restaurant');
    }

    // Validate slug if provided
    if (data.slug) {
      validateSlug(data.slug);
      const slugExists = await restaurantRepository.checkSlugExists(data.slug, restaurantId);
      if (slugExists) {
        throw new ValidationError('Slug already exists');
      }
    }

    const updated = await restaurantRepository.updateByTenantId(tenantId, restaurantId, data);
    
    // Invalidate cache
    await invalidateRestaurantCache(restaurantId);
    
    return updated;
  }
}

module.exports = new RestaurantService();

