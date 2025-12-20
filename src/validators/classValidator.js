 const {z} = require('zod');

const createClassSchema = z.object({
    name: z.string()
        .min(3, 'Class name must be at least 3 characters')
        .nonempty('Class name is required'),
    code: z.string()
        .min(2, 'Class code must be at least 2 characters')
        .nonempty('Class code is required')
        .transform(val => val.toUpperCase()),
    description: z.string().optional(),
    schedule: z.object({
        dayOfWeek: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
        startTime: z.string(),
        endTime: z.string()
    }).optional()
});

const updateClassSchema = z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    schedule: z.object({
        dayOfWeek: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
        startTime: z.string(),
        endTime: z.string()
    }).optional(),
    isActive: z.boolean().optional()
});

const classIdSchema = z.object({
    id: z.string().nonempty('Class ID is required')
});

module.exports = {
    createClassSchema,
    updateClassSchema,
    classIdSchema
};