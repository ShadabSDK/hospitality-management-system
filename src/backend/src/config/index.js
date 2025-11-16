require('dotenv').config();

module.exports = {
  // Server
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  apiVersion: process.env.API_VERSION || 'v1',
  
  // MongoDB
  mongodb: {
    uri: process.env.MONGODB_URI || process.env.MONGODB_URI_ATLAS || 'mongodb://localhost:27017/hospitality-management',
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRE || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
  },
  
  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
    url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
  },
  
  // AWS S3
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.AWS_S3_BUCKET || 'restaurant-menus-images',
    s3Endpoint: process.env.AWS_S3_ENDPOINT,
  },
  
  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  
  // URLs
  urls: {
    frontend: process.env.FRONTEND_URL || 'http://localhost:3000',
    apiBase: process.env.API_BASE_URL || 'http://localhost:3000/api/v1',
    menuBase: process.env.MENU_BASE_URL || 'http://localhost:3000/menu',
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Feature Flags
  features: {
    analytics: process.env.ENABLE_ANALYTICS === 'true',
    billing: process.env.ENABLE_BILLING === 'true',
  },
  
  // Billing Plans
  plans: {
    trial: {
      name: 'Free Trial',
      duration: 14, // days
      price: 0,
      features: ['all'],
    },
    basic: {
      name: 'Basic',
      price: 9.99,
      features: ['menu_management', 'qr_codes', 'basic_analytics', 'image_uploads'],
    },
    premium: {
      name: 'Premium',
      price: 29.99,
      features: ['menu_management', 'qr_codes', 'advanced_analytics', 'image_uploads', 'data_export', 'priority_support'],
    },
  },
};

