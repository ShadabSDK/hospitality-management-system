const categoryService = require('../services/category.service');
const { catchAsync } = require('../utils/helpers');

class CategoryController {
  createCategory = catchAsync(async (req, res) => {
    const { id: restaurantId } = req.params;
    const category = await categoryService.createCategory(req.tenantId, restaurantId, req.body);

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully',
    });
  });

  getCategories = catchAsync(async (req, res) => {
    const { id: restaurantId } = req.params;
    const categories = await categoryService.getCategories(req.tenantId, restaurantId);

    res.json({
      success: true,
      data: categories,
    });
  });

  updateCategory = catchAsync(async (req, res) => {
    const { id: categoryId } = req.params;
    const category = await categoryService.updateCategory(req.tenantId, categoryId, req.body);

    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully',
    });
  });

  deleteCategory = catchAsync(async (req, res) => {
    const { id: categoryId } = req.params;
    await categoryService.deleteCategory(req.tenantId, categoryId);

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  });
}

module.exports = new CategoryController();

