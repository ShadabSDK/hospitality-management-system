const menuService = require('../services/menu.service');
const { catchAsync } = require('../utils/helpers');

class MenuController {
  getMenuBySlug = catchAsync(async (req, res) => {
    const { slug } = req.params;
    const menu = await menuService.getMenuBySlug(slug, req);

    res.json({
      success: true,
      data: menu,
    });
  });

  renderMenu = catchAsync(async (req, res) => {
    const { slug } = req.params;
    const menu = await menuService.getMenuBySlug(slug, req);

    res.render('menu', {
      restaurant: menu.restaurant,
      categories: menu.categories,
    });
  });
}

module.exports = new MenuController();

