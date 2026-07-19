const userQueries = require('../db/queries/users');

async function listUsers() {
  const rows = await userQueries.listUsers();
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
  }));
}

module.exports = {
  listUsers,
};
