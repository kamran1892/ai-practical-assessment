const AppError = require('../utils/AppError');

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function parsePositiveInt(value, fieldName) {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(n) || n <= 0) {
    throw new AppError(400, `${fieldName} must be a positive integer`);
  }
  return n;
}

function validateCreateCommentBody(body) {
  if (!isPlainObject(body)) {
    throw new AppError(400, 'Request body must be a JSON object');
  }

  const errors = [];
  let message;
  let createdBy;

  if (typeof body.message !== 'string' || !body.message.trim()) {
    errors.push('message is required');
  } else {
    message = body.message.trim();
  }

  if (body.createdBy === undefined || body.createdBy === null || body.createdBy === '') {
    errors.push('createdBy is required');
  } else {
    try {
      createdBy = parsePositiveInt(body.createdBy, 'createdBy');
    } catch (err) {
      errors.push(err.message);
    }
  }

  if (errors.length) {
    throw new AppError(400, 'Validation failed', errors);
  }

  return { message, createdBy };
}

module.exports = {
  validateCreateCommentBody,
};
