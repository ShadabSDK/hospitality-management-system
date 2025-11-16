const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { enforceTenantIsolation } = require('../middlewares/tenant.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validation.middleware');
const { checkFeature } = require('../middlewares/featureFlag.middleware');

router.use(authenticate);
router.use(enforceTenantIsolation);
router.use(checkFeature('image_uploads'));

// Generate presigned URL
router.post(
  '/upload/presigned-url',
  [
    body('fileName').trim().notEmpty(),
    body('fileType').isIn(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
    body('fileSize').isInt({ min: 1, max: 5242880 }), // 5MB max
    validate,
  ],
  uploadController.generatePresignedUrl
);

module.exports = router;

