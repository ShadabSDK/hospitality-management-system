const { generateSlug } = require('../utils/helpers');

module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define('Restaurant', {
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Restaurant name is required',
        },
        len: {
          args: [1, 100],
          msg: 'Restaurant name cannot exceed 100 characters',
        },
      },
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: {
          args: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          msg: 'Invalid slug format',
        },
      },
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: 'Description cannot exceed 500 characters',
        },
      },
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'restaurants',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['slug'],
      },
      {
        fields: ['tenantId'],
      },
      {
        fields: ['tenantId', 'isActive'],
      },
    ],
    hooks: {
      beforeCreate: async (restaurant) => {
        if (!restaurant.slug && restaurant.name) {
          restaurant.slug = generateSlug(restaurant.name);
          
          // Ensure uniqueness
          const existing = await Restaurant.findOne({ where: { slug: restaurant.slug } });
          if (existing) {
            restaurant.slug = `${restaurant.slug}-${Date.now()}`;
          }
        }
      },
      beforeUpdate: async (restaurant) => {
        if (restaurant.changed('name') && !restaurant.changed('slug')) {
          restaurant.slug = generateSlug(restaurant.name);
          
          // Ensure uniqueness
          const existing = await Restaurant.findOne({ 
            where: { 
              slug: restaurant.slug,
              id: { [sequelize.Sequelize.Op.ne]: restaurant.id }
            } 
          });
          if (existing) {
            restaurant.slug = `${restaurant.slug}-${Date.now()}`;
          }
        }
      },
    },
  });

  return Restaurant;
};

