const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant ID is required'],
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
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    displayOrder: {
      type: Number,
      default: 0,
      min: [0, 'Display order must be non-negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
categorySchema.index({ restaurantId: 1, displayOrder: 1 });
categorySchema.index({ tenantId: 1 });
categorySchema.index({ restaurantId: 1, isActive: 1 });

// Virtual for dishes
categorySchema.virtual('dishes', {
  ref: 'Dish',
  localField: '_id',
  foreignField: 'categoryId',
  match: { isAvailable: true },
});

module.exports = mongoose.model('Category', categorySchema);

