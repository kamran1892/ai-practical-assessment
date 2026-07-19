const AppError = require('../utils/AppError');
const { PRIORITIES, STATUSES } = require('../domain/ticketConstants');

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

function requireNonEmptyString(value, fieldName, { maxLength } = {}) {
  if (typeof value !== 'string') {
    throw new AppError(400, `${fieldName} must be a string`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new AppError(400, `${fieldName} is required`);
  }
  if (maxLength && trimmed.length > maxLength) {
    throw new AppError(400, `${fieldName} must be at most ${maxLength} characters`);
  }
  return trimmed;
}

function parseTicketIdParam(id) {
  return parsePositiveInt(id, 'Ticket id');
}

function validateListQuery(query) {
  const filters = {};

  if (query.q !== undefined && query.q !== null && String(query.q).trim() !== '') {
    filters.q = String(query.q).trim();
  }

  if (query.status !== undefined && query.status !== null && String(query.status).trim() !== '') {
    const status = String(query.status).trim();
    if (!STATUSES.includes(status)) {
      throw new AppError(
        400,
        `Invalid status filter. Allowed values: ${STATUSES.join(', ')}`
      );
    }
    filters.status = status;
  }

  return filters;
}

function validateCreateTicketBody(body) {
  if (!isPlainObject(body)) {
    throw new AppError(400, 'Request body must be a JSON object');
  }

  if (Object.prototype.hasOwnProperty.call(body, 'status')) {
    throw new AppError(
      400,
      'status cannot be set on create; new tickets always start as Open'
    );
  }

  const errors = [];
  let title;
  let description;
  let priority;
  let createdBy;
  let assignedTo = null;

  try {
    title = requireNonEmptyString(body.title, 'title', { maxLength: 200 });
  } catch (err) {
    errors.push(err.message);
  }

  try {
    description = requireNonEmptyString(body.description, 'description');
  } catch (err) {
    errors.push(err.message);
  }

  if (body.priority === undefined || body.priority === null || body.priority === '') {
    errors.push('priority is required');
  } else if (!PRIORITIES.includes(body.priority)) {
    errors.push(`priority must be one of: ${PRIORITIES.join(', ')}`);
  } else {
    priority = body.priority;
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

  if (body.assignedTo !== undefined && body.assignedTo !== null && body.assignedTo !== '') {
    try {
      assignedTo = parsePositiveInt(body.assignedTo, 'assignedTo');
    } catch (err) {
      errors.push(err.message);
    }
  }

  if (errors.length) {
    throw new AppError(400, 'Validation failed', errors);
  }

  return { title, description, priority, createdBy, assignedTo };
}

function validateChangeStatusBody(body) {
  if (!isPlainObject(body)) {
    throw new AppError(400, 'Request body must be a JSON object');
  }

  if (body.status === undefined || body.status === null || body.status === '') {
    throw new AppError(400, 'status is required');
  }

  if (typeof body.status !== 'string' || !STATUSES.includes(body.status)) {
    throw new AppError(
      400,
      `Invalid status value. Allowed values: ${STATUSES.join(', ')}`
    );
  }

  return { status: body.status };
}

function validateUpdateTicketBody(body) {
  if (!isPlainObject(body)) {
    throw new AppError(400, 'Request body must be a JSON object');
  }

  if (Object.prototype.hasOwnProperty.call(body, 'status')) {
    throw new AppError(
      400,
      'status cannot be updated on this endpoint; use PATCH /api/tickets/:id/status'
    );
  }

  const allowed = ['title', 'description', 'priority', 'assignedTo'];
  const provided = allowed.filter((key) => Object.prototype.hasOwnProperty.call(body, key));

  if (!provided.length) {
    throw new AppError(
      400,
      'At least one of title, description, priority, assignedTo is required'
    );
  }

  const errors = [];
  const patch = {};

  if (Object.prototype.hasOwnProperty.call(body, 'title')) {
    try {
      patch.title = requireNonEmptyString(body.title, 'title', { maxLength: 200 });
    } catch (err) {
      errors.push(err.message);
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, 'description')) {
    try {
      patch.description = requireNonEmptyString(body.description, 'description');
    } catch (err) {
      errors.push(err.message);
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, 'priority')) {
    if (!PRIORITIES.includes(body.priority)) {
      errors.push(`priority must be one of: ${PRIORITIES.join(', ')}`);
    } else {
      patch.priority = body.priority;
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, 'assignedTo')) {
    if (body.assignedTo === null) {
      patch.assignedTo = null;
    } else if (body.assignedTo === '') {
      errors.push('assignedTo must be a positive integer or null');
    } else {
      try {
        patch.assignedTo = parsePositiveInt(body.assignedTo, 'assignedTo');
      } catch (err) {
        errors.push(err.message);
      }
    }
  }

  if (errors.length) {
    throw new AppError(400, 'Validation failed', errors);
  }

  return patch;
}

module.exports = {
  parseTicketIdParam,
  validateListQuery,
  validateCreateTicketBody,
  validateUpdateTicketBody,
  validateChangeStatusBody,
};
