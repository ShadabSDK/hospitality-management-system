/**
 * Restaurant Controller
 */

const Restaurant = require('../models/Restaurant');
const Analytics = require('../models/Analytics');
const slugify = require('slugify');

exports.createRestaurant = async (req, res) => {
  try {
    const { name, description, address, phone, email } = req.body;
    const tenantId = req.tenantId;

    const slug = slugify(name, { lower: true });

    const restaurant = new Restaurant({
      tenantId,
      name,
      slug,
      description,
      address,
      phone,
      email
    });

    await restaurant.save();
    res.status(201).json({ message: 'Restaurant created', restaurant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, address, phone, email } = req.body;

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      { name, description, address, phone, email, updatedAt: Date.now() },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({ message: 'Restaurant updated', restaurant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { startDate, endDate } = req.query;

    const query = { restaurantId };
    if (startDate && endDate) {
      query.timestamp = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const analytics = await Analytics.find(query).sort({ timestamp: -1 });

    const summary = {
      totalViews: analytics.filter(a => a.event === 'menu_view').length,
      totalScans: analytics.filter(a => a.event === 'qr_scan').length,
      totalDishClicks: analytics.filter(a => a.event === 'dish_click').length
    };

    res.json({ summary, analytics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
