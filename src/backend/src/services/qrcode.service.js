const QRCode = require('qrcode');
const qrCodeRepository = require('../repositories/qrcode.repository');
const restaurantRepository = require('../repositories/restaurant.repository');
const { NotFoundError } = require('../utils/errors');
const config = require('../config');
const { QR_CODE_SIZE, QR_CODE_ERROR_CORRECTION_LEVEL } = require('../utils/constants');

class QRCodeService {
  async generateQRCode(tenantId, restaurantId) {
    // Verify restaurant belongs to tenant
    const restaurant = await restaurantRepository.findByTenantIdAndId(tenantId, restaurantId);
    if (!restaurant) {
      throw new NotFoundError('Restaurant');
    }

    // Generate menu URL
    const menuUrl = `${config.urls.menuBase}/${restaurant.slug}`;

    // Generate QR code image
    let qrImageUrl = null;
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(menuUrl, {
        width: QR_CODE_SIZE,
        errorCorrectionLevel: QR_CODE_ERROR_CORRECTION_LEVEL,
      });

      // In production, upload to S3. For MVP, we can store as data URL or upload
      // For now, we'll store the data URL or upload to S3
      qrImageUrl = qrCodeDataUrl; // In production, upload to S3 and get URL
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error.message}`);
    }

    // Save or update QR code
    const qrCode = await qrCodeRepository.update(restaurantId, {
      tenantId,
      restaurantId,
      url: menuUrl,
      qrImageUrl,
    });

    return qrCode;
  }

  async getQRCode(tenantId, restaurantId) {
    // Verify restaurant belongs to tenant
    const restaurant = await restaurantRepository.findByTenantIdAndId(tenantId, restaurantId);
    if (!restaurant) {
      throw new NotFoundError('Restaurant');
    }

    let qrCode = await qrCodeRepository.findByTenantIdAndRestaurantId(tenantId, restaurantId);
    
    // If QR code doesn't exist, generate it
    if (!qrCode) {
      qrCode = await this.generateQRCode(tenantId, restaurantId);
    }

    return qrCode;
  }
}

module.exports = new QRCodeService();

