module.exports = {
  // User Roles
  ROLES: {
    ADMIN: 'admin',
    STAFF: 'staff',
  },

  // Billing Plans
  PLANS: {
    TRIAL: 'trial',
    BASIC: 'basic',
    PREMIUM: 'premium',
  },

  // Analytics Event Types
  ANALYTICS_EVENTS: {
    MENU_VIEW: 'menu_view',
    QR_SCAN: 'qr_scan',
    DISH_CLICK: 'dish_click',
  },

  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],

  // Cache TTL (in seconds)
  CACHE_TTL: {
    MENU: 3600, // 1 hour
    RESTAURANT: 1800, // 30 minutes
    TENANT: 900, // 15 minutes
  },

  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,

  // Analytics Retention (days)
  ANALYTICS_RETENTION_DAYS: 30,

  // QR Code
  QR_CODE_SIZE: 300,
  QR_CODE_ERROR_CORRECTION_LEVEL: 'M',
};

