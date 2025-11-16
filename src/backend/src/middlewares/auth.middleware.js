const { verifyAccessToken } = require('../utils/jwt');
const { AuthenticationError } = require('../utils/errors');
const userRepository = require('../repositories/user.repository');
const tenantRepository = require('../repositories/tenant.repository');

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyAccessToken(token);

    // Get user
    const user = await userRepository.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw new AuthenticationError('User not found or inactive');
    }

    // Get tenant
    const tenant = await tenantRepository.findById(decoded.tenantId);
    if (!tenant || !tenant.isActive) {
      throw new AuthenticationError('Tenant account is inactive');
    }

    // Attach user and tenant to request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    req.tenantId = tenant._id.toString();
    req.tenant = tenant;

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: error.message,
        },
      });
    }
    next(error);
  }
};

module.exports = { authenticate };

