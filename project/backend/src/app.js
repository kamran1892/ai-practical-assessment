const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/health');
const ticketRoutes = require('./routes/tickets');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/tickets', ticketRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
