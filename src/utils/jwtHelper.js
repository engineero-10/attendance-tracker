 const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '24h';

function generateToken(userId, role) {
    return jwt.sign(
        {id: userId, role: role},
        JWT_SECRET,
        {expiresIn: JWT_EXPIRES}
    );
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = {
    generateToken,
    verifyToken
};