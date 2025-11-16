const billingService = require('../services/billing.service');
const { AuthorizationError } = require('../utils/errors');

/**
 * Middleware to check if tenant has access to a feature
 */
const checkFeature = (feature) => {
  return async (req, res, next) => {
    try {
      if (!req.tenantId) {
        throw new AuthorizationError('Tenant context required');
      }

      const hasAccess = await billingService.checkFeatureAccess(req.tenantId, feature);
      
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FEATURE_NOT_AVAILABLE',
            message: `Feature '${feature}' is not available in your current plan`,
          },
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { checkFeature };

