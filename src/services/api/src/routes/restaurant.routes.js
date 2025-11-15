/**
 * Restaurant Routes
 * Restaurant, Category, and Dish management
 */

const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const categoryController = require('../controllers/category.controller');
const dishController = require('../controllers/dish.controller');
const qrController = require('../controllers/qr.controller');

// Restaurant CRUD
router.get('/:id', restaurantController.getRestaurant);
router.put('/:id', restaurantController.updateRestaurant);
router.post('/', restaurantController.createRestaurant);

// Categories
router.get('/:restaurantId/categories', categoryController.getCategories);
router.post('/:restaurantId/categories', categoryController.createCategory);
router.put('/categories/:categoryId', categoryController.updateCategory);
router.delete('/categories/:categoryId', categoryController.deleteCategory);

// Dishes
router.post('/:restaurantId/dishes', dishController.createDish);
router.put('/dishes/:dishId', dishController.updateDish);
router.delete('/dishes/:dishId', dishController.deleteDish);
router.get('/:restaurantId/dishes', dishController.getDishes);

// QR Code
router.post('/:restaurantId/qrcode', qrController.generateQRCode);
router.get('/:restaurantId/qrcode', qrController.getQRCode);

// Analytics
router.get('/:restaurantId/analytics', restaurantController.getAnalytics);

module.exports = router;
