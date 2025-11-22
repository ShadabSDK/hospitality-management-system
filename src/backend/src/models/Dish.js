module.exports = (sequelize, DataTypes) => {
  const Dish = sequelize.define('Dish', {
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
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'categories',
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
          msg: 'Dish name is required',
        },
        len: {
          args: [1, 100],
          msg: 'Dish name cannot exceed 100 characters',
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
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Price must be non-negative',
        },
      },
      get() {
        const value = this.getDataValue('price');
        return value ? parseFloat(value) : 0;
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
  }, {
    tableName: 'dishes',
    timestamps: true,
    indexes: [
      {
        fields: ['restaurantId', 'categoryId', 'displayOrder'],
      },
      {
        fields: ['tenantId'],
      },
      {
        fields: ['restaurantId', 'isAvailable'],
      },
      {
        fields: ['categoryId', 'isAvailable'],
      },
    ],
  });

  return Dish;
};

