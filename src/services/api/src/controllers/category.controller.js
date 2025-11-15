/**
 * Category Controller
 */

const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { name, description, order } = req.body;

    const category = new Category({
      restaurantId,
      name,
      description,
      order: order || 0
    });

    await category.save();
    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const categories = await Category.find({ restaurantId, isActive: true })
      .sort({ order: 1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description, order } = req.body;

    const category = await Category.findByIdAndUpdate(
      categoryId,
      { name, description, order, updatedAt: Date.now() },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category updated', category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findByIdAndUpdate(
      categoryId,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
