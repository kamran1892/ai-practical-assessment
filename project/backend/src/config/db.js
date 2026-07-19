const mysql = require('mysql2/promise');

function requiredEnv(name) {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const pool = mysql.createPool({
  host: requiredEnv('DB_HOST'),
  port: Number(process.env.DB_PORT || 3306),
  user: requiredEnv('DB_USER'),
  password: process.env.DB_PASSWORD ?? '',
  database: requiredEnv('DB_NAME'),
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

async function pingDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.query('SELECT 1 AS ok');
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  pingDatabase,
};
