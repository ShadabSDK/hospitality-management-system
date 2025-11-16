const restaurantService = require('../services/restaurant.service');
const { catchAsync } = require('../utils/helpers');

class RestaurantController {
  getRestaurant = catchAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await restaurantService.getRestaurant(req.tenantId, id);

    res.json({
      success: true,
      data: restaurant,
    });
  });

  updateRestaurant = catchAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await restaurantService.updateRestaurant(req.tenantId, id, req.body);

    res.json({
      success: true,
      data: restaurant,
      message: 'Restaurant updated successfully',
    });
  });
}

module.exports = new RestaurantController();

