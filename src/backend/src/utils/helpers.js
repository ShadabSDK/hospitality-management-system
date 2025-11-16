const crypto = require('crypto');

/**
 * Generate a random string
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate slug from string
 */
const generateSlug = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Sanitize string (remove HTML tags, trim)
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/<[^>]*>/g, '');
};

/**
 * Format currency
 */
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Calculate pagination metadata
 */
const getPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Extract IP address from request
 */
const getClientIp = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    'unknown'
  );
};

/**
 * Extract user agent from request
 */
const getUserAgent = (req) => {
  return req.headers['user-agent'] || 'unknown';
};

/**
 * Check if plan has feature
 */
const hasFeature = (plan, feature) => {
  const config = require('../config');
  const planConfig = config.plans[plan];
  if (!planConfig) return false;
  
  return planConfig.features.includes('all') || planConfig.features.includes(feature);
};

/**
 * Check if trial is expired
 */
const isTrialExpired = (trialEndsAt) => {
  if (!trialEndsAt) return false;
  return new Date() > new Date(trialEndsAt);
};

/**
 * Async error handler wrapper
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  generateRandomString,
  generateSlug,
  sanitizeString,
  formatCurrency,
  getPaginationMeta,
  getClientIp,
  getUserAgent,
  hasFeature,
  isTrialExpired,
  catchAsync,
};
