const express = require('express');
const config = require('../config');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', require('./auth.routes'));
router.use('/restaurants', require('./restaurant.routes'));
router.use('/api/v1', require('./category.routes'));
router.use('/api/v1', require('./dish.routes'));
router.use('/api/v1', require('./qrcode.routes'));
router.use('/api/v1', require('./upload.routes'));
router.use('/api/v1', require('./analytics.routes'));
router.use('/api/v1', require('./billing.routes'));

// Auth route for /auth/me
router.get('/auth/me', require('../middlewares/auth.middleware').authenticate, require('../controllers/auth.controller').getMe);

module.exports = router;

