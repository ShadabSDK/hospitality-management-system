const dishService = require('../../src/services/dish.service');
const dishRepository = require('../../src/repositories/dish.repository');
const categoryRepository = require('../../src/repositories/category.repository');
const restaurantRepository = require('../../src/repositories/restaurant.repository');
const { NotFoundError, ValidationError } = require('../../src/utils/errors');

jest.mock('../../src/repositories/dish.repository');
jest.mock('../../src/repositories/category.repository');
jest.mock('../../src/repositories/restaurant.repository');
jest.mock('../../src/utils/cache');

describe('DishService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createDish', () => {
    it('should create a dish successfully', async () => {
      const mockRestaurant = { _id: 'rest1', slug: 'test-restaurant' };
      const mockCategory = { _id: 'cat1', restaurantId: 'rest1' };
      const mockDish = {
        _id: 'dish1',
        name: 'Pizza',
        price: 12.99,
        restaurantId: 'rest1',
        categoryId: 'cat1',
      };

      restaurantRepository.findByTenantIdAndId.mockResolvedValue(mockRestaurant);
      categoryRepository.findByTenantIdAndId.mockResolvedValue(mockCategory);
      dishRepository.create.mockResolvedValue(mockDish);

      const result = await dishService.createDish('tenant1', 'rest1', {
        name: 'Pizza',
        price: 12.99,
        categoryId: 'cat1',
      });

      expect(result).toEqual(mockDish);
      expect(dishRepository.create).toHaveBeenCalled();
    });

    it('should throw NotFoundError if restaurant not found', async () => {
      restaurantRepository.findByTenantIdAndId.mockResolvedValue(null);

      await expect(
        dishService.createDish('tenant1', 'rest1', {
          name: 'Pizza',
          price: 12.99,
          categoryId: 'cat1',
        })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if category not found', async () => {
      const mockRestaurant = { _id: 'rest1' };
      restaurantRepository.findByTenantIdAndId.mockResolvedValue(mockRestaurant);
      categoryRepository.findByTenantIdAndId.mockResolvedValue(null);

      await expect(
        dishService.createDish('tenant1', 'rest1', {
          name: 'Pizza',
          price: 12.99,
          categoryId: 'cat1',
        })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateDish', () => {
    it('should update a dish successfully', async () => {
      const mockDish = { _id: 'dish1', restaurantId: 'rest1', categoryId: 'cat1' };
      const mockRestaurant = { _id: 'rest1', slug: 'test-restaurant' };

      dishRepository.findByTenantIdAndId.mockResolvedValue(mockDish);
      restaurantRepository.findById.mockResolvedValue(mockRestaurant);
      dishRepository.updateByTenantId.mockResolvedValue({ ...mockDish, name: 'Updated Pizza' });

      const result = await dishService.updateDish('tenant1', 'dish1', { name: 'Updated Pizza' });

      expect(result.name).toBe('Updated Pizza');
      expect(dishRepository.updateByTenantId).toHaveBeenCalled();
    });

    it('should throw NotFoundError if dish not found', async () => {
      dishRepository.findByTenantIdAndId.mockResolvedValue(null);

      await expect(
        dishService.updateDish('tenant1', 'dish1', { name: 'Updated Pizza' })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteDish', () => {
    it('should delete a dish successfully', async () => {
      const mockDish = { _id: 'dish1', restaurantId: 'rest1' };
      const mockRestaurant = { _id: 'rest1', slug: 'test-restaurant' };

      dishRepository.findByTenantIdAndId.mockResolvedValue(mockDish);
      restaurantRepository.findById.mockResolvedValue(mockRestaurant);
      dishRepository.deleteByTenantId.mockResolvedValue(mockDish);

      const result = await dishService.deleteDish('tenant1', 'dish1');

      expect(result).toHaveProperty('message');
      expect(dishRepository.deleteByTenantId).toHaveBeenCalled();
    });
  });
});

