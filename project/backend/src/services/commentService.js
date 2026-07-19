const AppError = require('../utils/AppError');
const ticketQueries = require('../db/queries/tickets');

function toIso(value) {
  if (!value) return value;
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
}

function mapComment(row) {
  return {
    id: row.id,
    ticketId: row.ticketId,
    message: row.message,
    createdBy: {
      id: row.createdById,
      name: row.createdByName,
    },
    createdAt: toIso(row.createdAt),
  };
}

function mapCommentListItem(row) {
  return {
    id: row.id,
    message: row.message,
    createdBy: {
      id: row.createdById,
      name: row.createdByName,
    },
    createdAt: toIso(row.createdAt),
  };
}

async function listComments(ticketId) {
  const exists = await ticketQueries.ticketExists(ticketId);
  if (!exists) {
    throw new AppError(404, 'Ticket not found');
  }

  const rows = await ticketQueries.listCommentsForTicket(ticketId);
  return rows.map(mapCommentListItem);
}

async function addComment(ticketId, input) {
  const exists = await ticketQueries.ticketExists(ticketId);
  if (!exists) {
    throw new AppError(404, 'Ticket not found');
  }

  const userExists = await ticketQueries.userExists(input.createdBy);
  if (!userExists) {
    throw new AppError(400, 'createdBy does not match an existing user');
  }

  const id = await ticketQueries.insertComment({
    ticketId,
    message: input.message,
    createdBy: input.createdBy,
  });

  const row = await ticketQueries.getCommentRowById(id);
  return mapComment(row);
}

module.exports = {
  listComments,
  addComment,
};
