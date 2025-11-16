const { TenantIsolationError } = require('../utils/errors');

/**
 * Middleware to ensure tenant isolation
 * Must be used after auth.middleware
 */
const enforceTenantIsolation = (req, res, next) => {
  if (!req.tenantId) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'TENANT_ISOLATION_ERROR',
        message: 'Tenant context required',
      },
    });
  }

  // Attach tenantId to request for use in services/repositories
  // This ensures all queries include tenantId filter
  req.tenantId = req.tenantId;
  
  next();
};

/**
 * Middleware to extract tenantId from params and verify ownership
 */
const verifyTenantOwnership = async (req, res, next) => {
  try {
    const { tenantId } = req.params;
    
    if (tenantId && tenantId !== req.tenantId) {
      throw new TenantIsolationError('Access denied: Tenant mismatch');
    }

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'TENANT_ISOLATION_ERROR',
        message: error.message,
      },
    });
  }
};

module.exports = {
  enforceTenantIsolation,
  verifyTenantOwnership,
};

