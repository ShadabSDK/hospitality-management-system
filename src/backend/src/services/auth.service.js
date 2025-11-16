const userRepository = require('../repositories/user.repository');
const tenantRepository = require('../repositories/tenant.repository');
const restaurantRepository = require('../repositories/restaurant.repository');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { AuthenticationError, ValidationError, ConflictError } = require('../utils/errors');
const { validateEmail, validatePassword } = require('../utils/validators');
const { PLANS } = require('../utils/constants');
const stripe = require('../config/stripe');
const config = require('../config');
const logger = require('../utils/logger');

class AuthService {
  async register(email, password, tenantName, restaurantName) {
    // Validate inputs
    validateEmail(email);
    validatePassword(password);

    // Check if email already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Create Stripe customer
    let stripeCustomerId = null;
    try {
      if (config.stripe.secretKey) {
        const customer = await stripe.customers.create({
          email,
          name: tenantName,
        });
        stripeCustomerId = customer.id;
      }
    } catch (error) {
      logger.error('Stripe customer creation failed:', error);
      // Continue without Stripe for MVP
    }

    // Create tenant
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    const tenant = await tenantRepository.create({
      name: tenantName,
      plan: PLANS.TRIAL,
      stripeCustomerId,
      trialEndsAt,
    });

    // Create restaurant
    const restaurant = await restaurantRepository.create({
      tenantId: tenant._id,
      name: restaurantName,
    });

    // Create admin user
    const user = await userRepository.create({
      email,
      password,
      tenantId: tenant._id,
    });

    // Generate tokens
    const tokenPayload = {
      userId: user._id.toString(),
      tenantId: tenant._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenantId: tenant._id,
      },
      tenant: {
        id: tenant._id,
        name: tenant.name,
        plan: tenant.plan,
        trialEndsAt: tenant.trialEndsAt,
      },
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
        slug: restaurant.slug,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async login(email, password) {
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    if (!user.isActive) {
      throw new AuthenticationError('Account is deactivated');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Update last login
    await userRepository.updateLastLogin(user._id);

    // Get tenant
    const tenant = await tenantRepository.findById(user.tenantId);
    if (!tenant || !tenant.isActive) {
      throw new AuthenticationError('Tenant account is inactive');
    }

    // Generate tokens
    const tokenPayload = {
      userId: user._id.toString(),
      tenantId: tenant._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenantId: tenant._id,
      },
      tenant: {
        id: tenant._id,
        name: tenant.name,
        plan: tenant.plan,
        trialEndsAt: tenant.trialEndsAt,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async refreshToken(refreshToken) {
    const { verifyRefreshToken, generateAccessToken } = require('../utils/jwt');
    
    try {
      const decoded = verifyRefreshToken(refreshToken);
      
      const user = await userRepository.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw new AuthenticationError('User not found or inactive');
      }

      const tenant = await tenantRepository.findById(user.tenantId);
      if (!tenant || !tenant.isActive) {
        throw new AuthenticationError('Tenant account is inactive');
      }

      const tokenPayload = {
        userId: user._id.toString(),
        tenantId: tenant._id.toString(),
        email: user.email,
        role: user.role,
      };

      const newAccessToken = generateAccessToken(tokenPayload);

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new AuthenticationError('Invalid refresh token');
    }
  }
}

module.exports = new AuthService();

