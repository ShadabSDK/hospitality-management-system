/**
 * Authentication Routes
 * POST /api/auth/register
 * POST /api/auth/login
 * GET /api/auth/me
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Register
router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('tenantName').notEmpty()
], authController.register);

// Login
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], authController.login);

// Get current user
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
