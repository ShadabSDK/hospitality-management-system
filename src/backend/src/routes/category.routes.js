const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { enforceTenantIsolation } = require('../middlewares/tenant.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validation.middleware');

router.use(authenticate);
router.use(enforceTenantIsolation);

// Create category
router.post(
  '/restaurants/:id/categories',
  [
    body('name').trim().notEmpty().isLength({ max: 100 }),
    body('displayOrder').optional().isInt({ min: 0 }),
    validate,
  ],
  categoryController.createCategory
);

// Get categories
router.get('/restaurants/:id/categories', categoryController.getCategories);

// Update category
router.put(
  '/categories/:id',
  [
    body('name').optional().trim().isLength({ max: 100 }),
    body('displayOrder').optional().isInt({ min: 0 }),
    validate,
  ],
  categoryController.updateCategory
);

// Delete category
router.delete('/categories/:id', categoryController.deleteCategory);

module.exports = router;

