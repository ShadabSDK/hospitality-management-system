/**
 * QRCode Schema
 */

const mongoose = require('mongoose');

const QRCodeSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  qrCodeData: {
    type: String, // Base64 or S3 URL of QR code image
    default: null
  },
  scans: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

QRCodeSchema.index({ restaurantId: 1 });

module.exports = mongoose.model('QRCode', QRCodeSchema);
