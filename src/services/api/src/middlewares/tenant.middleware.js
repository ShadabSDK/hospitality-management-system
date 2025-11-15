/**
 * Tenant Isolation Middleware
 * Ensures requests are validated against tenant ownership
 */

const tenantMiddleware = (req, res, next) => {
  try {
    // Extract tenantId from user JWT
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      return res.status(403).json({ error: 'Tenant ID not found in token' });
    }

    req.tenantId = tenantId;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Tenant validation failed' });
  }
};

module.exports = tenantMiddleware;
