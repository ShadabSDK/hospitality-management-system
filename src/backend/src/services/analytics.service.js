const analyticsRepository = require('../repositories/analytics.repository');
const { ANALYTICS_EVENTS, ANALYTICS_RETENTION_DAYS } = require('../utils/constants');
const { getClientIp, getUserAgent } = require('../utils/helpers');

class AnalyticsService {
  async logEvent(tenantId, restaurantId, eventType, metadata = {}) {
    if (!Object.values(ANALYTICS_EVENTS).includes(eventType)) {
      throw new Error(`Invalid event type: ${eventType}`);
    }

    return await analyticsRepository.create({
      tenantId,
      restaurantId,
      eventType,
      metadata: {
        ...metadata,
      },
    });
  }

  async logMenuView(restaurantId, req) {
    const tenantId = req.tenantId; // Set by middleware
    return await this.logEvent(tenantId, restaurantId, ANALYTICS_EVENTS.MENU_VIEW, {
      userAgent: getUserAgent(req),
      ipAddress: getClientIp(req),
    });
  }

  async logQRScan(restaurantId, req) {
    const tenantId = req.tenantId; // Set by middleware
    return await this.logEvent(tenantId, restaurantId, ANALYTICS_EVENTS.QR_SCAN, {
      userAgent: getUserAgent(req),
      ipAddress: getClientIp(req),
    });
  }

  async logDishClick(restaurantId, dishId, categoryId, req) {
    const tenantId = req.tenantId; // Set by middleware
    return await this.logEvent(tenantId, restaurantId, ANALYTICS_EVENTS.DISH_CLICK, {
      dishId,
      categoryId,
      userAgent: getUserAgent(req),
      ipAddress: getClientIp(req),
    });
  }

  async getAnalytics(tenantId, restaurantId, days = ANALYTICS_RETENTION_DAYS) {
    const eventCounts = await analyticsRepository.getEventCountsByType(tenantId, days);
    const topDishes = await analyticsRepository.getTopDishes(restaurantId, 10, days);

    return {
      eventCounts,
      topDishes,
      period: days,
    };
  }
}

module.exports = new AnalyticsService();

