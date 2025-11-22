const { Sequelize } = require('sequelize');
const config = require('./index');
const logger = require('../utils/logger');

let sequelize = null;

const connectDB = async () => {
  if (sequelize) {
    logger.info('Using existing database connection');
    return sequelize;
  }

  try {
    sequelize = new Sequelize(config.database.url, {
      host: config.database.host,
      port: config.database.port,
      dialect: 'postgres',
      logging: config.env === 'development' ? (msg) => logger.debug(msg) : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      dialectOptions: {
        ssl: config.database.ssl ? {
          require: true,
          rejectUnauthorized: false,
        } : false,
      },
    });

    // Test the connection
    await sequelize.authenticate();
    logger.info('PostgreSQL Connected successfully');

    // Sync models (create tables if they don't exist)
    if (config.env === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('Database synchronized');
    }

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await sequelize.close();
      logger.info('PostgreSQL connection closed through app termination');
      process.exit(0);
    });

    return sequelize;
  } catch (error) {
    logger.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  if (sequelize) {
    await sequelize.close();
    sequelize = null;
    logger.info('PostgreSQL disconnected');
  }
};

const getSequelize = () => {
  return sequelize;
};

module.exports = {
  connectDB,
  disconnectDB,
  getSequelize,
  isConnected: () => !!sequelize,
};

