/**
 * Validator Utility
 */

exports.validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

exports.validatePassword = (password) => {
  return password && password.length >= 6;
};

exports.validatePrice = (price) => {
  return price && price > 0;
};

exports.validateSlug = (slug) => {
  return slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
};

exports.sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  return input;
};
