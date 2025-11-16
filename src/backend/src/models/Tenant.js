const mongoose = require('mongoose');
const { PLANS } = require('../utils/constants');

const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tenant name is required'],
      trim: true,
      maxlength: [100, 'Tenant name cannot exceed 100 characters'],
    },
    plan: {
      type: String,
      enum: Object.values(PLANS),
      default: PLANS.TRIAL,
      required: true,
    },
    stripeCustomerId: {
      type: String,
      sparse: true,
      index: true,
    },
    trialEndsAt: {
      type: Date,
      default: function() {
        if (this.plan === PLANS.TRIAL) {
          const trialEnd = new Date();
          trialEnd.setDate(trialEnd.getDate() + 14); // 14 days trial
          return trialEnd;
        }
        return null;
      },
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
tenantSchema.index({ stripeCustomerId: 1 });
tenantSchema.index({ plan: 1 });
tenantSchema.index({ isActive: 1 });

// Virtual for checking if trial is active
tenantSchema.virtual('isTrialActive').get(function() {
  if (this.plan !== PLANS.TRIAL) return false;
  return this.trialEndsAt && new Date() < this.trialEndsAt;
});

module.exports = mongoose.model('Tenant', tenantSchema);

