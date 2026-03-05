/**
 * Error Handler Middleware
 * Centralized error handling for the application
 */

/**
 * Custom error response handler
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Details:', err);
  }

  // PostgreSQL duplicate key error (unique constraint)
  if (err.code === '23505') {
    const message = 'Duplicate field value entered';
    error = {
      statusCode: 400,
      message: message
    };
  }

  // PostgreSQL foreign key constraint error
  if (err.code === '23503') {
    const message = 'Foreign key constraint violation';
    error = {
      statusCode: 400,
      message: message
    };
  }

  // PostgreSQL invalid input syntax
  if (err.code === '22P02') {
    const message = 'Invalid input syntax';
    error = {
      statusCode: 400,
      message: message
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = {
      statusCode: 401,
      message: message
    };
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = {
      statusCode: 401,
      message: message
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
