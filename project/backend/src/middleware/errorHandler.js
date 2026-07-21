function notFoundHandler(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  // Invalid JSON body from express.json()
  if (err instanceof SyntaxError && err.status === 400 && Object.hasOwn(err, 'body')) {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }

  const statusCode = err.statusCode || err.status || 500;

  if (statusCode >= 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  const message =
    statusCode === 500 ? 'Internal server error' : err.message || 'Request failed';

  res.status(statusCode).json({
    message,
    ...(Array.isArray(err.errors) && err.errors.length ? { errors: err.errors } : {}),
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
