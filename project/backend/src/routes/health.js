const express = require('express');
const { pingDatabase } = require('../config/db');

const router = express.Router();

// Liveness: process is up
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'support-tickets-api',
  });
});

// Readiness: MySQL reachable with current env
router.get('/db', async (req, res, next) => {
  try {
    await pingDatabase();
    res.status(200).json({
      status: 'ok',
      database: process.env.DB_NAME,
    });
  } catch (err) {
    err.statusCode = 503;
    err.message = `Database connection failed: ${err.message}`;
    next(err);
  }
});

module.exports = router;
