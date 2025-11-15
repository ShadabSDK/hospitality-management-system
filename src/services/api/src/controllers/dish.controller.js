/**
 * Dish Controller
 */

const Dish = require('../models/Dish');

exports.createDish = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { categoryId, name, description, price, tags, preparationTime } = req.body;

    const dish = new Dish({
      categoryId,
      restaurantId,
      name,
      description,
      price,
      tags: tags || [],
      preparationTime: preparationTime || 0
    });

    await dish.save();
    res.status(201).json({ message: 'Dish created', dish });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDishes = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const dishes = await Dish.find({ restaurantId }).populate('categoryId');
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDish = async (req, res) => {
  try {
    const { dishId } = req.params;
    const { name, description, price, isAvailable, tags, preparationTime } = req.body;

    const dish = await Dish.findByIdAndUpdate(
      dishId,
      { name, description, price, isAvailable, tags, preparationTime, updatedAt: Date.now() },
      { new: true }
    );

    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    res.json({ message: 'Dish updated', dish });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDish = async (req, res) => {
  try {
    const { dishId } = req.params;

    await Dish.findByIdAndDelete(dishId);
    res.json({ message: 'Dish deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
