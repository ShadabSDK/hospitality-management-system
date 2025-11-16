const { getRedisClient } = require('../config/redis');
const logger = require('./logger');
const { CACHE_TTL } = require('./constants');

/**
 * Get value from cache
 */
const get = async (key) => {
  try {
    const client = getRedisClient();
    if (!client || !client.isOpen) {
      return null;
    }

    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error(`Cache get error for key ${key}:`, error);
    return null;
  }
};

/**
 * Set value in cache
 */
const set = async (key, value, ttl = null) => {
  try {
    const client = getRedisClient();
    if (!client || !client.isOpen) {
      return false;
    }

    const serialized = JSON.stringify(value);
    if (ttl) {
      await client.setEx(key, ttl, serialized);
    } else {
      await client.set(key, serialized);
    }
    return true;
  } catch (error) {
    logger.error(`Cache set error for key ${key}:`, error);
    return false;
  }
};

/**
 * Delete value from cache
 */
const del = async (key) => {
  try {
    const client = getRedisClient();
    if (!client || !client.isOpen) {
      return false;
    }

    await client.del(key);
    return true;
  } catch (error) {
    logger.error(`Cache delete error for key ${key}:`, error);
    return false;
  }
};

/**
 * Delete multiple keys matching pattern
 */
const delPattern = async (pattern) => {
  try {
    const client = getRedisClient();
    if (!client || !client.isOpen) {
      return false;
    }

    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
    return true;
  } catch (error) {
    logger.error(`Cache delete pattern error for ${pattern}:`, error);
    return false;
  }
};

/**
 * Cache menu data
 */
const cacheMenu = async (slug, data) => {
  return await set(`menu:${slug}`, data, CACHE_TTL.MENU);
};

/**
 * Get cached menu data
 */
const getCachedMenu = async (slug) => {
  return await get(`menu:${slug}`);
};

/**
 * Invalidate menu cache
 */
const invalidateMenuCache = async (slug) => {
  return await del(`menu:${slug}`);
};

/**
 * Cache restaurant data
 */
const cacheRestaurant = async (id, data) => {
  return await set(`restaurant:${id}`, data, CACHE_TTL.RESTAURANT);
};

/**
 * Get cached restaurant data
 */
const getCachedRestaurant = async (id) => {
  return await get(`restaurant:${id}`);
};

/**
 * Invalidate restaurant cache
 */
const invalidateRestaurantCache = async (id) => {
  return await del(`restaurant:${id}`);
};

module.exports = {
  get,
  set,
  del,
  delPattern,
  cacheMenu,
  getCachedMenu,
  invalidateMenuCache,
  cacheRestaurant,
  getCachedRestaurant,
  invalidateRestaurantCache,
};

