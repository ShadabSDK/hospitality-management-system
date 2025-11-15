/**
 * Analytics Schema
 */

const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  event: {
    type: String,
    enum: ['menu_view', 'qr_scan', 'dish_click'],
    required: true
  },
  dishId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish',
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// TTL index - auto-delete analytics older than 90 days
AnalyticsSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });
AnalyticsSchema.index({ restaurantId: 1, timestamp: 1 });

module.exports = mongoose.model('Analytics', AnalyticsSchema);
