const menuService = require('../../src/services/menu.service');
const restaurantRepository = require('../../src/repositories/restaurant.repository');
const categoryRepository = require('../../src/repositories/category.repository');
const dishRepository = require('../../src/repositories/dish.repository');
const { NotFoundError } = require('../../src/utils/errors');
const { getCachedMenu, cacheMenu } = require('../../src/utils/cache');

jest.mock('../../src/repositories/restaurant.repository');
jest.mock('../../src/repositories/category.repository');
jest.mock('../../src/repositories/dish.repository');
jest.mock('../../src/utils/cache');
jest.mock('../../src/services/analytics.service');

describe('MenuService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMenuBySlug', () => {
    it('should return cached menu if available', async () => {
      const mockCachedMenu = {
        restaurant: { _id: 'rest1', name: 'Test Restaurant' },
        categories: [],
      };

      getCachedMenu.mockResolvedValue(mockCachedMenu);

      const result = await menuService.getMenuBySlug('test-restaurant', {});

      expect(result).toEqual(mockCachedMenu);
      expect(restaurantRepository.findBySlug).not.toHaveBeenCalled();
    });

    it('should fetch menu from database if not cached', async () => {
      const mockRestaurant = { _id: 'rest1', name: 'Test Restaurant', slug: 'test-restaurant', isActive: true };
      const mockCategories = [{ _id: 'cat1', name: 'Appetizers' }];
      const mockDishes = [{ _id: 'dish1', name: 'Wings', price: 9.99 }];

      getCachedMenu.mockResolvedValue(null);
      restaurantRepository.findBySlug.mockResolvedValue(mockRestaurant);
      categoryRepository.findByRestaurantId.mockResolvedValue(mockCategories);
      dishRepository.findByCategoryId.mockResolvedValue(mockDishes);
      cacheMenu.mockResolvedValue(true);

      const result = await menuService.getMenuBySlug('test-restaurant', {});

      expect(result).toHaveProperty('restaurant');
      expect(result).toHaveProperty('categories');
      expect(cacheMenu).toHaveBeenCalled();
    });

    it('should throw NotFoundError if restaurant not found', async () => {
      getCachedMenu.mockResolvedValue(null);
      restaurantRepository.findBySlug.mockResolvedValue(null);

      await expect(
        menuService.getMenuBySlug('non-existent', {})
      ).rejects.toThrow(NotFoundError);
    });
  });
});

