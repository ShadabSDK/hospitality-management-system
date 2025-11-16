const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant ID is required'],
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category ID is required'],
      index: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: [true, 'Tenant ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Dish name is required'],
      trim: true,
      maxlength: [100, 'Dish name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be non-negative'],
      get: function(value) {
        return parseFloat(value.toFixed(2));
      },
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      min: [0, 'Display order must be non-negative'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  }
);

// Indexes
dishSchema.index({ restaurantId: 1, categoryId: 1, displayOrder: 1 });
dishSchema.index({ tenantId: 1 });
dishSchema.index({ restaurantId: 1, isAvailable: 1 });
dishSchema.index({ categoryId: 1, isAvailable: 1 });

module.exports = mongoose.model('Dish', dishSchema);

