require('dotenv').config();

const app = require('./app');
const { pingDatabase } = require('./config/db');

const PORT = Number(process.env.PORT || 3001);

async function start() {
  try {
    await pingDatabase();
    console.log(`MySQL connected (database: ${process.env.DB_NAME})`);
  } catch (err) {
    console.error('Failed to connect to MySQL on startup:', err.message);
    console.error('Check project/backend/.env and that schema/seed have been applied.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
    console.log(`Health:    GET http://localhost:${PORT}/health`);
    console.log(`DB health: GET http://localhost:${PORT}/health/db`);
  });
}

start();
