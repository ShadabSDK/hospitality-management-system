const express = require('express');
const router = express.Router();
const qrCodeController = require('../controllers/qrcode.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { enforceTenantIsolation } = require('../middlewares/tenant.middleware');
const { checkFeature } = require('../middlewares/featureFlag.middleware');

router.use(authenticate);
router.use(enforceTenantIsolation);
router.use(checkFeature('qr_codes'));

// Generate QR code
router.post('/restaurants/:id/qrcode', qrCodeController.generateQRCode);

// Get QR code
router.get('/restaurants/:id/qrcode', qrCodeController.getQRCode);

module.exports = router;

