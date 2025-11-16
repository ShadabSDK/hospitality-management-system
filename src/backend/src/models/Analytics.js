const mongoose = require('mongoose');
const { ANALYTICS_EVENTS } = require('../utils/constants');

const analyticsSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: [true, 'Tenant ID is required'],
      index: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant ID is required'],
      index: true,
    },
    eventType: {
      type: String,
      enum: Object.values(ANALYTICS_EVENTS),
      required: [true, 'Event type is required'],
      index: true,
    },
    metadata: {
      dishId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
      },
      categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
      userAgent: {
        type: String,
      },
      ipAddress: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for efficient queries
analyticsSchema.index({ tenantId: 1, createdAt: -1 });
analyticsSchema.index({ restaurantId: 1, eventType: 1, createdAt: -1 });
analyticsSchema.index({ eventType: 1, createdAt: -1 });
analyticsSchema.index({ 'metadata.dishId': 1, createdAt: -1 });

// TTL index to auto-delete old analytics (optional - can be managed manually)
// analyticsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days

module.exports = mongoose.model('Analytics', analyticsSchema);

