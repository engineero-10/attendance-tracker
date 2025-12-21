 const bcrypt = require('bcrypt');
const {generateToken} = require('../utils/jwtHelper');
const {AppError} = require('../utils/errorHandler');
const {
    findUserByUsername,
    findUserByEmail,
    createUser
} = require('../repositories/userRepository');

const signupService = async (userData) => {
    // Check if username already exists
    const existingUser = await findUserByUsername(userData.username);
    if (existingUser) {
        throw new AppError('Username already exists', 409);
    }

    // Check if email already exists
    const existingEmail = await findUserByEmail(userData.email);
    if (existingEmail) {
        throw new AppError('Email already exists', 409);
    }

    // Create new user
    const newUser = await createUser({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName,
        role: userData.role || 'student'
    });

    return {
        user: newUser,
        token: generateToken(newUser._id, newUser.role)
    };
}

const loginService = async (username, password) => {
    // Find user with password
    const user = await findUserByUsername(username, true);
    if (!user) {
        throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError('Invalid credentials', 401);
    }

    // Remove password from response
    user.password = undefined;

    return {
        user,
        token: generateToken(user._id, user.role)
    };
}

module.exports = {
    signupService,
    loginService
};