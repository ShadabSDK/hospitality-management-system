const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant ID is required'],
      unique: true, // One QR code per restaurant
      index: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: [true, 'Tenant ID is required'],
      index: true,
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
    },
    qrImageUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
qrCodeSchema.index({ restaurantId: 1 }, { unique: true });
qrCodeSchema.index({ tenantId: 1 });

module.exports = mongoose.model('QRCode', qrCodeSchema);

