const { pool } = require('../../config/db');

const TICKET_SELECT = `
  SELECT
    t.id,
    t.title,
    t.description,
    t.priority,
    t.status,
    t.created_at AS createdAt,
    t.updated_at AS updatedAt,
    t.assigned_to AS assignedToId,
    assignee.name AS assignedToName,
    t.created_by AS createdById,
    creator.name AS createdByName
  FROM tickets t
  LEFT JOIN users assignee ON assignee.id = t.assigned_to
  INNER JOIN users creator ON creator.id = t.created_by
`;

async function userExists(userId) {
  const [rows] = await pool.execute(
    'SELECT id FROM users WHERE id = :id LIMIT 1',
    { id: userId }
  );
  return rows.length > 0;
}

async function listTickets({ q, status } = {}) {
  const where = [];
  const params = {};

  if (q) {
    where.push('(t.title LIKE :q OR t.description LIKE :q)');
    params.q = `%${q}%`;
  }

  if (status) {
    where.push('t.status = :status');
    params.status = status;
  }

  const sql = `
    ${TICKET_SELECT}
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY t.created_at DESC, t.id DESC
  `;

  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function getTicketRowById(id) {
  const [rows] = await pool.execute(
    `${TICKET_SELECT} WHERE t.id = :id LIMIT 1`,
    { id }
  );
  return rows[0] || null;
}

async function listCommentsForTicket(ticketId) {
  const [rows] = await pool.execute(
    `
      SELECT
        c.id,
        c.message,
        c.created_at AS createdAt,
        c.created_by AS createdById,
        u.name AS createdByName
      FROM comments c
      INNER JOIN users u ON u.id = c.created_by
      WHERE c.ticket_id = :ticketId
      ORDER BY c.created_at ASC, c.id ASC
    `,
    { ticketId }
  );
  return rows;
}

async function insertTicket({ title, description, priority, createdBy, assignedTo }) {
  const [result] = await pool.execute(
    `
      INSERT INTO tickets (title, description, priority, status, assigned_to, created_by)
      VALUES (:title, :description, :priority, 'Open', :assignedTo, :createdBy)
    `,
    {
      title,
      description,
      priority,
      assignedTo,
      createdBy,
    }
  );
  return result.insertId;
}

async function updateTicketFields(id, patch) {
  const sets = [];
  const params = { id };

  if (patch.title !== undefined) {
    sets.push('title = :title');
    params.title = patch.title;
  }
  if (patch.description !== undefined) {
    sets.push('description = :description');
    params.description = patch.description;
  }
  if (patch.priority !== undefined) {
    sets.push('priority = :priority');
    params.priority = patch.priority;
  }
  if (patch.assignedTo !== undefined) {
    sets.push('assigned_to = :assignedTo');
    params.assignedTo = patch.assignedTo;
  }

  if (!sets.length) {
    return;
  }

  await pool.execute(
    `UPDATE tickets SET ${sets.join(', ')} WHERE id = :id`,
    params
  );
}

module.exports = {
  userExists,
  listTickets,
  getTicketRowById,
  listCommentsForTicket,
  insertTicket,
  updateTicketFields,
};
