const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/health');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/api/health', healthRoutes);

// Ticket / user routes will be mounted under /api in a later step

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
