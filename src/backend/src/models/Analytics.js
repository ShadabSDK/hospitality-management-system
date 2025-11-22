const { ANALYTICS_EVENTS } = require('../utils/constants');

module.exports = (sequelize, DataTypes) => {
  const Analytics = sequelize.define('Analytics', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'tenants',
        key: 'id',
      },
    },
    restaurantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'restaurants',
        key: 'id',
      },
    },
    eventType: {
      type: DataTypes.ENUM(...Object.values(ANALYTICS_EVENTS)),
      allowNull: false,
    },
    dishId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'dishes',
        key: 'id',
      },
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'analytics',
    timestamps: true,
    indexes: [
      {
        fields: ['tenantId', 'createdAt'],
      },
      {
        fields: ['restaurantId', 'eventType', 'createdAt'],
      },
      {
        fields: ['eventType', 'createdAt'],
      },
      {
        fields: ['dishId', 'createdAt'],
      },
    ],
  });

  return Analytics;
};

