const {z} = require('zod');

const signupSchema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .nonempty('Username is required'),
    email: z.string()
        .email('Invalid email address')
        .nonempty('Email is required'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(20, 'Password must be at most 20 characters')
        .nonempty('Password is required'),
    confirmPassword: z.string()
        .nonempty('Confirm password is required'),
    fullName: z.string()
        .min(3, 'Full name must be at least 3 characters')
        .nonempty('Full name is required'),
    role: z.enum(['student', 'teacher'], {
        errorMap: () => ({message: 'Role must be either student or teacher'})
    }).optional()
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
});

const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required')
});

module.exports = {
    signupSchema,
    loginSchema
};