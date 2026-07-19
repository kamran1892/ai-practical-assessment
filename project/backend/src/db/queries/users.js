const { pool } = require('../../config/db');

async function listUsers() {
  const [rows] = await pool.execute(
    `
      SELECT id, name, email, role
      FROM users
      ORDER BY name ASC, id ASC
    `
  );
  return rows;
}

module.exports = {
  listUsers,
};
