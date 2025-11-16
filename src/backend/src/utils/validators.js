const Joi = require('joi');
const { ValidationError } = require('./errors');

/**
 * Validate email format
 */
const validateEmail = (email) => {
  const schema = Joi.string().email().required();
  const { error } = schema.validate(email);
  if (error) {
    throw new ValidationError('Invalid email format');
  }
  return true;
};

/**
 * Validate password strength
 */
const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const schema = Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    });

  const { error } = schema.validate(password);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }
  return true;
};

/**
 * Validate MongoDB ObjectId
 */
const validateObjectId = (id) => {
  const schema = Joi.string().hex().length(24).required();
  const { error } = schema.validate(id);
  if (error) {
    throw new ValidationError('Invalid ID format');
  }
  return true;
};

/**
 * Validate slug format
 */
const validateSlug = (slug) => {
  const schema = Joi.string()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens',
    });

  const { error } = schema.validate(slug);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }
  return true;
};

/**
 * Validate price (positive number with 2 decimal places)
 */
const validatePrice = (price) => {
  const schema = Joi.number().positive().precision(2).required();
  const { error } = schema.validate(price);
  if (error) {
    throw new ValidationError('Price must be a positive number with up to 2 decimal places');
  }
  return true;
};

/**
 * Validate pagination parameters
 */
const validatePagination = (page, limit) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  });

  const { error, value } = schema.validate({ page, limit });
  if (error) {
    throw new ValidationError('Invalid pagination parameters');
  }
  return value;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateObjectId,
  validateSlug,
  validatePrice,
  validatePagination,
};

