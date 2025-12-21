 // Error handler utility
class AppError extends Error {
  constructor(message, code, data = null) {
    super(message);
    this.code = code;
    this.data = data;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {AppError};