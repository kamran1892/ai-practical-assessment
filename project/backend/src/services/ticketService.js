const AppError = require('../utils/AppError');
const ticketQueries = require('../db/queries/tickets');
const { assertCanTransition } = require('../domain/statusTransition');

function toIso(value) {
  if (!value) return value;
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
}

function mapUserRef(id, name) {
  if (id == null) return null;
  return { id, name };
}

function mapTicketSummary(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    priority: row.priority,
    status: row.status,
    assignedTo: mapUserRef(row.assignedToId, row.assignedToName),
    createdBy: mapUserRef(row.createdById, row.createdByName),
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
  };
}

function mapComment(row) {
  return {
    id: row.id,
    message: row.message,
    createdBy: mapUserRef(row.createdById, row.createdByName),
    createdAt: toIso(row.createdAt),
  };
}

async function assertUserExists(userId, fieldName) {
  const exists = await ticketQueries.userExists(userId);
  if (!exists) {
    throw new AppError(400, `${fieldName} does not match an existing user`);
  }
}

async function getTicketDetail(id) {
  const row = await ticketQueries.getTicketRowById(id);
  if (!row) {
    throw new AppError(404, 'Ticket not found');
  }

  const comments = await ticketQueries.listCommentsForTicket(id);
  return {
    ...mapTicketSummary(row),
    comments: comments.map(mapComment),
  };
}

async function listTickets(filters) {
  const rows = await ticketQueries.listTickets(filters);
  return rows.map(mapTicketSummary);
}

async function createTicket(input) {
  await assertUserExists(input.createdBy, 'createdBy');
  if (input.assignedTo != null) {
    await assertUserExists(input.assignedTo, 'assignedTo');
  }

  const id = await ticketQueries.insertTicket(input);
  return getTicketDetail(id);
}

async function updateTicket(id, patch) {
  const existing = await ticketQueries.getTicketRowById(id);
  if (!existing) {
    throw new AppError(404, 'Ticket not found');
  }

  if (patch.assignedTo !== undefined && patch.assignedTo !== null) {
    await assertUserExists(patch.assignedTo, 'assignedTo');
  }

  await ticketQueries.updateTicketFields(id, patch);
  return getTicketDetail(id);
}

async function changeStatus(id, nextStatus) {
  const existing = await ticketQueries.getTicketRowById(id);
  if (!existing) {
    throw new AppError(404, 'Ticket not found');
  }

  assertCanTransition(existing.status, nextStatus);
  await ticketQueries.updateTicketStatus(id, nextStatus);
  return getTicketDetail(id);
}

module.exports = {
  listTickets,
  getTicketDetail,
  createTicket,
  updateTicket,
  changeStatus,
};
