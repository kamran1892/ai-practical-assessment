export const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed', 'Cancelled'];

export const PRIORITIES = ['Low', 'Medium', 'High'];

/** Mirror of backend allowed transitions (UX only). Backend statusTransition.js is the source of truth. */
export const ALLOWED_TRANSITIONS = {
  Open: ['In Progress', 'Cancelled'],
  'In Progress': ['Resolved', 'Cancelled'],
  Resolved: ['Closed'],
  Closed: [],
  Cancelled: [],
};

export function getAllowedNextStatuses(current) {
  return ALLOWED_TRANSITIONS[current] || [];
}
