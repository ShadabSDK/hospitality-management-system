const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { enforceTenantIsolation } = require('../middlewares/tenant.middleware');
const { checkFeature } = require('../middlewares/featureFlag.middleware');

router.use(authenticate);
router.use(enforceTenantIsolation);
router.use(checkFeature('basic_analytics'));

// Get analytics
router.get('/restaurants/:id/analytics', analyticsController.getAnalytics);

module.exports = router;

