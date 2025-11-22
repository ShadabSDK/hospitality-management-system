const { Sequelize, DataTypes } = require('sequelize');
const { getSequelize } = require('../config/database');

// Import model definitions
const TenantModel = require('./Tenant');
const AdminUserModel = require('./AdminUser');
const RestaurantModel = require('./Restaurant');
const CategoryModel = require('./Category');
const DishModel = require('./Dish');
const QRCodeModel = require('./QRCode');
const AnalyticsModel = require('./Analytics');

const initModels = () => {
  const sequelize = getSequelize();
  
  if (!sequelize) {
    throw new Error('Database connection not established');
  }

  // Initialize models
  const Tenant = TenantModel(sequelize, DataTypes);
  const AdminUser = AdminUserModel(sequelize, DataTypes);
  const Restaurant = RestaurantModel(sequelize, DataTypes);
  const Category = CategoryModel(sequelize, DataTypes);
  const Dish = DishModel(sequelize, DataTypes);
  const QRCode = QRCodeModel(sequelize, DataTypes);
  const Analytics = AnalyticsModel(sequelize, DataTypes);

  // Define associations
  // Tenant associations
  Tenant.hasMany(AdminUser, { foreignKey: 'tenantId', as: 'users' });
  Tenant.hasMany(Restaurant, { foreignKey: 'tenantId', as: 'restaurants' });

  // AdminUser associations
  AdminUser.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

  // Restaurant associations
  Restaurant.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });
  Restaurant.hasMany(Category, { foreignKey: 'restaurantId', as: 'categories' });
  Restaurant.hasMany(Dish, { foreignKey: 'restaurantId', as: 'dishes' });
  Restaurant.hasOne(QRCode, { foreignKey: 'restaurantId', as: 'qrCode' });
  Restaurant.hasMany(Analytics, { foreignKey: 'restaurantId', as: 'analytics' });

  // Category associations
  Category.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });
  Category.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });
  Category.hasMany(Dish, { foreignKey: 'categoryId', as: 'dishes' });

  // Dish associations
  Dish.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });
  Dish.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
  Dish.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

  // QRCode associations
  QRCode.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });
  QRCode.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

  // Analytics associations
  Analytics.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });
  Analytics.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });
  Analytics.belongsTo(Dish, { foreignKey: 'dishId', as: 'dish', allowNull: true });
  Analytics.belongsTo(Category, { foreignKey: 'categoryId', as: 'category', allowNull: true });

  return {
    sequelize,
    Tenant,
    AdminUser,
    Restaurant,
    Category,
    Dish,
    QRCode,
    Analytics,
  };
};

module.exports = initModels;
