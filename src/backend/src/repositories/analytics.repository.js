const Analytics = require('../models/Analytics');
const { ANALYTICS_RETENTION_DAYS } = require('../utils/constants');

class AnalyticsRepository {
  async create(data) {
    return await Analytics.create(data);
  }

  async findByTenantId(tenantId, days = ANALYTICS_RETENTION_DAYS) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await Analytics.find({
      tenantId,
      createdAt: { $gte: startDate },
    }).sort({ createdAt: -1 });
  }

  async findByRestaurantId(restaurantId, days = ANALYTICS_RETENTION_DAYS) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await Analytics.find({
      restaurantId,
      createdAt: { $gte: startDate },
    }).sort({ createdAt: -1 });
  }

  async getEventCountsByType(tenantId, days = ANALYTICS_RETENTION_DAYS) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await Analytics.aggregate([
      {
        $match: {
          tenantId: tenantId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);
  }

  async getTopDishes(restaurantId, limit = 10, days = ANALYTICS_RETENTION_DAYS) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await Analytics.aggregate([
      {
        $match: {
          restaurantId,
          eventType: 'dish_click',
          'metadata.dishId': { $exists: true },
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$metadata.dishId',
          clicks: { $sum: 1 },
        },
      },
      {
        $sort: { clicks: -1 },
      },
      {
        $limit: limit,
      },
    ]);
  }

  async getAnalyticsByDateRange(tenantId, startDate, endDate) {
    return await Analytics.find({
      tenantId,
      createdAt: { $gte: startDate, $lte: endDate },
    }).sort({ createdAt: -1 });
  }

  async deleteOldAnalytics(days = ANALYTICS_RETENTION_DAYS) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return await Analytics.deleteMany({
      createdAt: { $lt: cutoffDate },
    });
  }
}

module.exports = new AnalyticsRepository();

