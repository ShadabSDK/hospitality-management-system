const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authLimiter } = require('../middlewares/rateLimit.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validation.middleware');

// Register
router.post(
  '/register',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)
      .withMessage('Password must contain uppercase, lowercase, and number'),
    body('tenantName').trim().notEmpty().withMessage('Tenant name is required'),
    body('restaurantName').trim().notEmpty().withMessage('Restaurant name is required'),
    validate,
  ],
  authController.register
);

// Login
router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  authController.login
);

// Refresh token
router.post(
  '/refresh',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
    validate,
  ],
  authController.refreshToken
);

module.exports = router;

