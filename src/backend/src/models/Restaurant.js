const mongoose = require('mongoose');
const { generateSlug } = require('../utils/helpers');

const restaurantSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: [true, 'Tenant ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
      maxlength: [100, 'Restaurant name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'],
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    logoUrl: {
      type: String,
      trim: true,
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
restaurantSchema.index({ slug: 1 }, { unique: true });
restaurantSchema.index({ tenantId: 1 });
restaurantSchema.index({ tenantId: 1, isActive: 1 });

// Generate slug from name if not provided
restaurantSchema.pre('save', async function(next) {
  if (!this.slug && this.name) {
    this.slug = generateSlug(this.name);
    
    // Ensure uniqueness
    const existing = await mongoose.model('Restaurant').findOne({ slug: this.slug });
    if (existing && existing._id.toString() !== this._id.toString()) {
      this.slug = `${this.slug}-${Date.now()}`;
    }
  }
  next();
});

// Virtual for categories
restaurantSchema.virtual('categories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'restaurantId',
});

// Virtual for dishes count
restaurantSchema.virtual('dishesCount', {
  ref: 'Dish',
  localField: '_id',
  foreignField: 'restaurantId',
  count: true,
});

module.exports = mongoose.model('Restaurant', restaurantSchema);

