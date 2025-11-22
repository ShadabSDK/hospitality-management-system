const initModels = require('../models');
const { ANALYTICS_RETENTION_DAYS } = require('../utils/constants');
const { Op } = require('sequelize');

class AnalyticsRepository {
  constructor() {
    this.models = null;
  }

  getModels() {
    if (!this.models) {
      this.models = initModels();
    }
    return this.models;
  }

  async create(data) {
    const { Analytics } = this.getModels();
    return await Analytics.create(data);
  }

  async findByTenantId(tenantId, days = ANALYTICS_RETENTION_DAYS) {
    const { Analytics } = this.getModels();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await Analytics.findAll({
      where: {
        tenantId,
        createdAt: { [Op.gte]: startDate },
      },
      order: [['createdAt', 'DESC']],
    });
  }

  async findByRestaurantId(restaurantId, days = ANALYTICS_RETENTION_DAYS) {
    const { Analytics } = this.getModels();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await Analytics.findAll({
      where: {
        restaurantId,
        createdAt: { [Op.gte]: startDate },
      },
      order: [['createdAt', 'DESC']],
    });
  }

  async getEventCountsByType(tenantId, days = ANALYTICS_RETENTION_DAYS) {
    const { Analytics, sequelize } = this.getModels();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await Analytics.findAll({
      attributes: [
        'eventType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      where: {
        tenantId,
        createdAt: { [Op.gte]: startDate },
      },
      group: ['eventType'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
    });
  }

  async getTopDishes(restaurantId, limit = 10, days = ANALYTICS_RETENTION_DAYS) {
    const { Analytics, sequelize } = this.getModels();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await Analytics.findAll({
      attributes: [
        'dishId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'clicks'],
      ],
      where: {
        restaurantId,
        eventType: 'dish_click',
        dishId: { [Op.ne]: null },
        createdAt: { [Op.gte]: startDate },
      },
      group: ['dishId'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit,
    });
  }

  async getAnalyticsByDateRange(tenantId, startDate, endDate) {
    const { Analytics } = this.getModels();
    return await Analytics.findAll({
      where: {
        tenantId,
        createdAt: { [Op.between]: [startDate, endDate] },
      },
      order: [['createdAt', 'DESC']],
    });
  }

  async deleteOldAnalytics(days = ANALYTICS_RETENTION_DAYS) {
    const { Analytics } = this.getModels();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return await Analytics.destroy({
      where: {
        createdAt: { [Op.lt]: cutoffDate },
      },
    });
  }
}

module.exports = new AnalyticsRepository();

