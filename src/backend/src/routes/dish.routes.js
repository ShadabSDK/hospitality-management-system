const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dish.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { enforceTenantIsolation } = require('../middlewares/tenant.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validation.middleware');

router.use(authenticate);
router.use(enforceTenantIsolation);

// Create dish
router.post(
  '/restaurants/:id/dishes',
  [
    body('name').trim().notEmpty().isLength({ max: 100 }),
    body('description').optional().trim().isLength({ max: 500 }),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('categoryId').isMongoId().withMessage('Valid category ID is required'),
    body('imageUrl').optional().isURL(),
    body('displayOrder').optional().isInt({ min: 0 }),
    validate,
  ],
  dishController.createDish
);

// Update dish
router.put(
  '/dishes/:id',
  [
    body('name').optional().trim().isLength({ max: 100 }),
    body('description').optional().trim().isLength({ max: 500 }),
    body('price').optional().isFloat({ min: 0 }),
    body('categoryId').optional().isMongoId(),
    body('imageUrl').optional().isURL(),
    body('displayOrder').optional().isInt({ min: 0 }),
    validate,
  ],
  dishController.updateDish
);

// Delete dish
router.delete('/dishes/:id', dishController.deleteDish);

// Toggle availability
router.patch(
  '/dishes/:id/availability',
  [
    body('isAvailable').isBoolean().withMessage('isAvailable must be a boolean'),
    validate,
  ],
  dishController.toggleAvailability
);

module.exports = router;

