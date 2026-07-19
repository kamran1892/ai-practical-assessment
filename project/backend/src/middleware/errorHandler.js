function notFoundHandler(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);

  const statusCode = err.statusCode || 500;
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
