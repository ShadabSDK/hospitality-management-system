const mongoose = require('mongoose');
const config = require('./index');
const logger = require('../utils/logger');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    logger.info('Using existing database connection');
    return;
  }

  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    const connection = await mongoose.connect(config.mongodb.uri, options);
    
    isConnected = true;
    logger.info(`MongoDB Connected: ${connection.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
      isConnected = true;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.connection.close();
    isConnected = false;
    logger.info('MongoDB disconnected');
  }
};

module.exports = {
  connectDB,
  disconnectDB,
  isConnected: () => isConnected,
};

