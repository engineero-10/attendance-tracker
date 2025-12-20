 const express = require('express');
const authRouter = express.Router();
const {signupController, loginController} = require('../controllers/authController');
const {signupSchema, loginSchema} = require('../validators/authValidator');
const {validateFactory} = require('../middlewares/validateFactory');

// POST /auth/signup
authRouter.post('/signup', 
    validateFactory(signupSchema, 'body'), 
    signupController
);

// POST /auth/login
authRouter.post('/login', 
    validateFactory(loginSchema, 'body'), 
    loginController
);

module.exports = {authRouter};