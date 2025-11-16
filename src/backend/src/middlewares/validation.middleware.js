const { validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

/**
 * Middleware to handle validation errors from express-validator
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => ({
      field: err.param,
      message: err.msg,
      value: err.value,
    }));

    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errorMessages,
      },
    });
  }

  next();
};

module.exports = { validate };

