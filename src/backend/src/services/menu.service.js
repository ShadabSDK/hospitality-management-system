const restaurantRepository = require('../repositories/restaurant.repository');
const categoryRepository = require('../repositories/category.repository');
const dishRepository = require('../repositories/dish.repository');
const { NotFoundError } = require('../utils/errors');
const { getCachedMenu, cacheMenu } = require('../utils/cache');
const analyticsService = require('./analytics.service');

class MenuService {
  async getMenuBySlug(slug, req) {
    // Check cache first
    const cachedMenu = await getCachedMenu(slug);
    if (cachedMenu) {
      // Set tenantId for analytics (public menu, so tenantId comes from restaurant)
      req.tenantId = cachedMenu.restaurant.tenantId;
      // Log analytics (async, don't wait)
      analyticsService.logMenuView(cachedMenu.restaurant._id, req).catch(() => {});
      return cachedMenu;
    }

    // Fetch from database
    const restaurant = await restaurantRepository.findBySlug(slug);
    if (!restaurant || !restaurant.isActive) {
      throw new NotFoundError('Restaurant');
    }

    // Set tenantId for analytics
    req.tenantId = restaurant.tenantId;

    // Get categories with dishes
    const categories = await categoryRepository.findByRestaurantId(restaurant._id);
    
    const categoriesWithDishes = await Promise.all(
      categories.map(async (category) => {
        const dishes = await dishRepository.findByCategoryId(category._id);
        return {
          ...category.toObject(),
          dishes,
        };
      })
    );

    const menuData = {
      restaurant: restaurant.toObject(),
      categories: categoriesWithDishes,
    };

    // Cache the menu
    await cacheMenu(slug, menuData);

    // Log analytics (async, don't wait)
    analyticsService.logMenuView(restaurant._id, req).catch(() => {});

    return menuData;
  }
}

module.exports = new MenuService();

