const analyticsService = require('../services/analytics.service');
const { catchAsync } = require('../utils/helpers');

class AnalyticsController {
  getAnalytics = catchAsync(async (req, res) => {
    const { id: restaurantId } = req.params;
    const { days = 30 } = req.query;

    const analytics = await analyticsService.getAnalytics(
      req.tenantId,
      restaurantId,
      parseInt(days)
    );

    res.json({
      success: true,
      data: analytics,
    });
  });
}

module.exports = new AnalyticsController();

