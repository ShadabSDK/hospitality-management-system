const redis = require('redis');
const config = require('./index');
const logger = require('../utils/logger');

let client = null;

const connectRedis = async () => {
  if (client && client.isOpen) {
    logger.info('Using existing Redis connection');
    return client;
  }

  try {
    client = redis.createClient({
      url: config.redis.url,
      password: config.redis.password || undefined,
    });

    client.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    client.on('connect', () => {
      logger.info('Redis Client Connected');
    });

    client.on('ready', () => {
      logger.info('Redis Client Ready');
    });

    await client.connect();
    return client;
  } catch (error) {
    logger.error('Redis connection error:', error);
    // Don't exit - app can work without Redis (with degraded performance)
    return null;
  }
};

const getRedisClient = () => {
  return client;
};

const disconnectRedis = async () => {
  if (client && client.isOpen) {
    await client.quit();
    logger.info('Redis disconnected');
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  disconnectRedis,
};

