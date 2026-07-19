/** Shared allowed values. Transition rules live only in statusTransition.js (next step). */

const PRIORITIES = ['Low', 'Medium', 'High'];

const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed', 'Cancelled'];

module.exports = {
  PRIORITIES,
  STATUSES,
};
