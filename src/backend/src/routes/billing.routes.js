const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billing.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { enforceTenantIsolation } = require('../middlewares/tenant.middleware');

router.use(authenticate);
router.use(enforceTenantIsolation);

// Get billing info
router.get('/billing', billingController.getBillingInfo);

// Create billing portal session
router.post('/billing/portal', billingController.createBillingPortal);

module.exports = router;

