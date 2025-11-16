const billingService = require('../services/billing.service');
const { catchAsync } = require('../utils/helpers');

class BillingController {
  getBillingInfo = catchAsync(async (req, res) => {
    const billingInfo = await billingService.getBillingInfo(req.tenantId);

    res.json({
      success: true,
      data: billingInfo,
    });
  });

  createBillingPortal = catchAsync(async (req, res) => {
    const result = await billingService.createBillingPortalSession(req.tenantId);

    res.json({
      success: true,
      data: result,
    });
  });
}

module.exports = new BillingController();

