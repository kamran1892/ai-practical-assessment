/**
 * Single source of truth for ticket status transitions.
 * Keep this module pure (no DB/HTTP) so it is easy to unit/integration test.
 */

const AppError = require('../utils/AppError');
const { STATUSES } = require('./ticketConstants');

const ALLOWED_TRANSITIONS = Object.freeze({
  Open: Object.freeze(['In Progress', 'Cancelled']),
  'In Progress': Object.freeze(['Resolved', 'Cancelled']),
  Resolved: Object.freeze(['Closed']),
  Closed: Object.freeze([]),
  Cancelled: Object.freeze([]),
});

function isKnownStatus(status) {
  return STATUSES.includes(status);
}

function getAllowedTransitions(fromStatus) {
  if (!isKnownStatus(fromStatus)) {
    return [];
  }
  return [...ALLOWED_TRANSITIONS[fromStatus]];
}

function canTransition(fromStatus, toStatus) {
  if (!isKnownStatus(fromStatus) || !isKnownStatus(toStatus)) {
    return false;
  }
  if (fromStatus === toStatus) {
    return false;
  }
  return ALLOWED_TRANSITIONS[fromStatus].includes(toStatus);
}

function assertCanTransition(fromStatus, toStatus) {
  if (!isKnownStatus(toStatus)) {
    throw new AppError(
      400,
      `Invalid status value. Allowed values: ${STATUSES.join(', ')}`
    );
  }

  if (!isKnownStatus(fromStatus)) {
    throw new AppError(400, `Ticket has unknown current status: ${fromStatus}`);
  }

  if (!canTransition(fromStatus, toStatus)) {
    const allowed = getAllowedTransitions(fromStatus);
    const hint =
      allowed.length > 0
        ? ` Allowed next status values: ${allowed.join(', ')}.`
        : ' This status is terminal; no further transitions are allowed.';
    throw new AppError(
      400,
      `Invalid status transition from ${fromStatus} to ${toStatus}.${hint}`
    );
  }
}

module.exports = {
  ALLOWED_TRANSITIONS,
  isKnownStatus,
  getAllowedTransitions,
  canTransition,
  assertCanTransition,
};
