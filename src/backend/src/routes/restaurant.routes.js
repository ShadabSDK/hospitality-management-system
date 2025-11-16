const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { enforceTenantIsolation } = require('../middlewares/tenant.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validation.middleware');

// All routes require authentication
router.use(authenticate);
router.use(enforceTenantIsolation);

// Get restaurant
router.get('/:id', restaurantController.getRestaurant);

// Update restaurant
router.put(
  '/:id',
  [
    body('name').optional().trim().isLength({ min: 1, max: 100 }),
    body('description').optional().trim().isLength({ max: 500 }),
    body('slug').optional().matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    validate,
  ],
  restaurantController.updateRestaurant
);

module.exports = router;

