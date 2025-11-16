const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');
const { menuLimiter } = require('../middlewares/rateLimit.middleware');

// Public routes - no authentication required

// Render HTML menu page
router.get('/:slug', menuLimiter, menuController.renderMenu);

// Get menu data as JSON
router.get('/api/:slug', menuLimiter, menuController.getMenuBySlug);

module.exports = router;

