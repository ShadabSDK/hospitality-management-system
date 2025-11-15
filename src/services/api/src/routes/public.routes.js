/**
 * Public Routes
 * GET /menu/:slug - Public menu viewer (no auth required)
 */

const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');

// Get menu by restaurant slug
router.get('/:slug', publicController.getMenuBySlug);

// Track menu view
router.post('/:slug/track', publicController.trackMenuView);

module.exports = router;
