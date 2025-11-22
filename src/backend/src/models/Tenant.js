const { PLANS } = require('../utils/constants');

module.exports = (sequelize, DataTypes) => {
  const Tenant = sequelize.define('Tenant', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Tenant name is required',
        },
        len: {
          args: [1, 100],
          msg: 'Tenant name cannot exceed 100 characters',
        },
      },
    },
    plan: {
      type: DataTypes.ENUM(...Object.values(PLANS)),
      defaultValue: PLANS.TRIAL,
      allowNull: false,
    },
    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    trialEndsAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'tenants',
    timestamps: true,
    indexes: [
      {
        fields: ['stripeCustomerId'],
      },
      {
        fields: ['plan'],
      },
      {
        fields: ['isActive'],
      },
    ],
    hooks: {
      beforeCreate: (tenant) => {
        if (tenant.plan === PLANS.TRIAL && !tenant.trialEndsAt) {
          const trialEnd = new Date();
          trialEnd.setDate(trialEnd.getDate() + 14); // 14 days trial
          tenant.trialEndsAt = trialEnd;
        }
      },
    },
  });

  // Instance method for checking if trial is active
  Tenant.prototype.isTrialActive = function() {
    if (this.plan !== PLANS.TRIAL) return false;
    return this.trialEndsAt && new Date() < this.trialEndsAt;
  };

  return Tenant;
};

