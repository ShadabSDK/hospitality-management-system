/**
 * Tenant Routes
 * GET /api/tenants/:id
 * PUT /api/tenants/:id
 */

const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenant.controller');

// Get tenant details
router.get('/:id', tenantController.getTenant);

// Update tenant
router.put('/:id', tenantController.updateTenant);

// Get billing info
router.get('/:id/billing', tenantController.getBillingInfo);

module.exports = router;
