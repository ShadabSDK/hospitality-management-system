const qrCodeService = require('../services/qrcode.service');
const { catchAsync } = require('../utils/helpers');

class QRCodeController {
  generateQRCode = catchAsync(async (req, res) => {
    const { id: restaurantId } = req.params;
    const qrCode = await qrCodeService.generateQRCode(req.tenantId, restaurantId);

    res.json({
      success: true,
      data: qrCode,
      message: 'QR code generated successfully',
    });
  });

  getQRCode = catchAsync(async (req, res) => {
    const { id: restaurantId } = req.params;
    const qrCode = await qrCodeService.getQRCode(req.tenantId, restaurantId);

    res.json({
      success: true,
      data: qrCode,
    });
  });
}

module.exports = new QRCodeController();

