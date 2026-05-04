import logger from '../config/logger.js';

export default (err, req, res, next) => {
  const status = err.statusCode || 500;

  logger.error({
    message:  err.message,
    code:     err.code,
    status,
    method:   req.method,
    url:      req.originalUrl,
    userId:   req.user?.id ?? null,
    stack:    err.stack,
  });

  res.status(status).json({
    success: false,
    error: {
      code:    err.code || 'SERVER_ERROR',
      message: err.isOperational
        ? err.message
        : 'Internal server error',
    }
  });
};