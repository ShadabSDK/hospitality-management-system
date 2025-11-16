const dishService = require('../services/dish.service');
const { catchAsync } = require('../utils/helpers');

class DishController {
  createDish = catchAsync(async (req, res) => {
    const { id: restaurantId } = req.params;
    const dish = await dishService.createDish(req.tenantId, restaurantId, req.body);

    res.status(201).json({
      success: true,
      data: dish,
      message: 'Dish created successfully',
    });
  });

  updateDish = catchAsync(async (req, res) => {
    const { id: dishId } = req.params;
    const dish = await dishService.updateDish(req.tenantId, dishId, req.body);

    res.json({
      success: true,
      data: dish,
      message: 'Dish updated successfully',
    });
  });

  deleteDish = catchAsync(async (req, res) => {
    const { id: dishId } = req.params;
    await dishService.deleteDish(req.tenantId, dishId);

    res.json({
      success: true,
      message: 'Dish deleted successfully',
    });
  });

  toggleAvailability = catchAsync(async (req, res) => {
    const { id: dishId } = req.params;
    const { isAvailable } = req.body;
    const dish = await dishService.toggleAvailability(req.tenantId, dishId, isAvailable);

    res.json({
      success: true,
      data: dish,
      message: 'Dish availability updated successfully',
    });
  });
}

module.exports = new DishController();

