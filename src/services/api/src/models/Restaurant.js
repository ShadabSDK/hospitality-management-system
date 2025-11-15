/**
 * Restaurant Schema
 */

const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  logo: {
    type: String, // S3 URL
    default: null
  },
  bannerImage: {
    type: String, // S3 URL
    default: null
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  isActive: {
    type: Boolean,
    default: true
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

// Compound index for tenantId + slug
RestaurantSchema.index({ tenantId: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Restaurant', RestaurantSchema);
