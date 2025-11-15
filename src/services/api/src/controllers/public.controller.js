/**
 * Public Controller
 * Handles public menu viewer routes
 */

const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const Dish = require('../models/Dish');
const Analytics = require('../models/Analytics');

exports.getMenuBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const restaurant = await Restaurant.findOne({ slug, isActive: true });
    if (!restaurant) {
      return res.status(404).send('Restaurant not found');
    }

    const categories = await Category.find({ restaurantId: restaurant._id, isActive: true })
      .sort({ order: 1 });

    const dishes = await Dish.find({ restaurantId: restaurant._id, isAvailable: true });

    // Track analytics
    const analytics = new Analytics({
      restaurantId: restaurant._id,
      event: 'menu_view',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    await analytics.save();

    // Render menu HTML
    res.render('menu', {
      restaurant,
      categories,
      dishes
    });
  } catch (error) {
    res.status(500).send('Error loading menu');
  }
};

exports.trackMenuView = async (req, res) => {
  try {
    const { slug } = req.params;

    const restaurant = await Restaurant.findOne({ slug });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const analytics = new Analytics({
      restaurantId: restaurant._id,
      event: 'menu_view',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    await analytics.save();

    res.json({ message: 'View tracked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
