const {signupService, loginService} = require('../services/authService');

const signupController = async (req, res, next) => {
    try {
        console.log('📝 Signup request body:', req.body);
        
        const {username, password, email, fullName, role} = req.body;
        
        console.log('✅ Calling signupService...');
        const result = await signupService({
            username,
            password,
            email,
            fullName,
            role
        });

        console.log('✅ Service completed successfully');
        res.status(201).json({
            message: 'Account created successfully',
            user: result.user,
            token: result.token
        });
    } catch (error) {
        console.error('❌ Error in signupController:', error);
        next(error);
    }
}
const loginController = async (req, res, next) => {
    try {
        const {username, password} = req.body;
        
        const result = await loginService(username, password);

        res.status(200).json({
            message: 'Login successful',
            user: result.user,
            token: result.token
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    signupController,
    loginController
}; 