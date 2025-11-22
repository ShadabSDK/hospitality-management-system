const app = require('./src/app');
const config = require('./src/config');
const { connectDB } = require('./src/config/database');
const { connectRedis } = require('./src/config/redis');
const initModels = require('./src/models');
const logger = require('./src/utils/logger');

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    // Connect to PostgreSQL
    await connectDB();

    // Initialize Sequelize models
    const models = initModels();
    logger.info('Database models initialized');

    // Connect to Redis (optional - app works without it)
    await connectRedis().catch((err) => {
      logger.warn('Redis connection failed, continuing without cache:', err.message);
    });

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.env} mode`);
      logger.info(`Database: PostgreSQL`);
      logger.info(`API Documentation: http://localhost:${config.port}/api/v1/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

