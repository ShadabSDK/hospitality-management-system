/**
 * QR Code Controller
 */

const QRCode = require('../models/QRCode');
const QRCodeLib = require('qrcode');
const Restaurant = require('../models/Restaurant');

exports.generateQRCode = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const menuUrl = `${process.env.APP_URL || 'http://localhost:3000'}/menu/${restaurant.slug}`;

    // Generate QR code
    const qrCodeData = await QRCodeLib.toDataURL(menuUrl);

    // Save or update QR code
    let qrCode = await QRCode.findOne({ restaurantId });
    if (!qrCode) {
      qrCode = new QRCode({
        restaurantId,
        url: menuUrl,
        qrCodeData
      });
    } else {
      qrCode.url = menuUrl;
      qrCode.qrCodeData = qrCodeData;
    }

    await qrCode.save();
    res.json({ message: 'QR code generated', qrCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getQRCode = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const qrCode = await QRCode.findOne({ restaurantId });
    if (!qrCode) {
      return res.status(404).json({ error: 'QR code not found' });
    }

    res.json(qrCode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
