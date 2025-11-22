module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    restaurantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'restaurants',
        key: 'id',
      },
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
          msg: 'Category name is required',
        },
        len: {
          args: [1, 100],
          msg: 'Category name cannot exceed 100 characters',
        },
      },
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Display order must be non-negative',
        },
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'categories',
    timestamps: true,
    indexes: [
      {
        fields: ['restaurantId', 'displayOrder'],
      },
      {
        fields: ['tenantId'],
      },
      {
        fields: ['restaurantId', 'isActive'],
      },
    ],
  });

  return Category;
};

