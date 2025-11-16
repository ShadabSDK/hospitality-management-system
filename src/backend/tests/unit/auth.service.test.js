const authService = require('../../src/services/auth.service');
const userRepository = require('../../src/repositories/user.repository');
const tenantRepository = require('../../src/repositories/tenant.repository');
const restaurantRepository = require('../../src/repositories/restaurant.repository');
const { AuthenticationError, ConflictError } = require('../../src/utils/errors');

jest.mock('../../src/repositories/user.repository');
jest.mock('../../src/repositories/tenant.repository');
jest.mock('../../src/repositories/restaurant.repository');
jest.mock('../../src/config/stripe');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockTenant = { _id: 'tenant1', name: 'Test Tenant', plan: 'trial' };
      const mockRestaurant = { _id: 'rest1', name: 'Test Restaurant', slug: 'test-restaurant' };
      const mockUser = { _id: 'user1', email: 'test@example.com', tenantId: 'tenant1' };

      userRepository.findByEmail.mockResolvedValue(null);
      tenantRepository.create.mockResolvedValue(mockTenant);
      restaurantRepository.create.mockResolvedValue(mockRestaurant);
      userRepository.create.mockResolvedValue(mockUser);

      const result = await authService.register(
        'test@example.com',
        'Password123',
        'Test Tenant',
        'Test Restaurant'
      );

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tenant');
      expect(result).toHaveProperty('restaurant');
      expect(result).toHaveProperty('tokens');
      expect(userRepository.create).toHaveBeenCalled();
    });

    it('should throw ConflictError if email already exists', async () => {
      userRepository.findByEmail.mockResolvedValue({ _id: 'user1', email: 'test@example.com' });

      await expect(
        authService.register('test@example.com', 'Password123', 'Test Tenant', 'Test Restaurant')
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        _id: 'user1',
        email: 'test@example.com',
        tenantId: 'tenant1',
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      const mockTenant = { _id: 'tenant1', name: 'Test Tenant', isActive: true };

      userRepository.findByEmail.mockResolvedValue(mockUser);
      tenantRepository.findById.mockResolvedValue(mockTenant);
      userRepository.updateLastLogin.mockResolvedValue(mockUser);

      const result = await authService.login('test@example.com', 'Password123');

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokens');
      expect(mockUser.comparePassword).toHaveBeenCalledWith('Password123');
    });

    it('should throw AuthenticationError with invalid credentials', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login('test@example.com', 'WrongPassword')
      ).rejects.toThrow(AuthenticationError);
    });

    it('should throw AuthenticationError with wrong password', async () => {
      const mockUser = {
        _id: 'user1',
        email: 'test@example.com',
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      userRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(
        authService.login('test@example.com', 'WrongPassword')
      ).rejects.toThrow(AuthenticationError);
    });
  });
});

