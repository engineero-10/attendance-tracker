 const {verifyToken} = require('../utils/jwtHelper');
const {findUserById} = require('../repositories/userRepository');
const {AppError} = require('../utils/errorHandler');

async function isLoggedIn(req, res, next) {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  try {
    if (!token) {
      throw new AppError('Not authenticated. Please login', 401);
    }

    const decoded = verifyToken(token);
    const user = await findUserById(decoded.id);
    
    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 401));
    } else if (err.name === 'TokenExpiredError') {
      next(new AppError('Token expired. Please login again', 401));
    } else {
      next(err);
    }
  }
}

module.exports = {isLoggedIn};