const {z} = require('zod');

const markAttendanceSchema = z.object({
    classId: z.string().nonempty('Class ID is required'),
    studentId: z.string().nonempty('Student ID is required'),
    status: z.enum(['present', 'absent'], {
        errorMap: () => ({message: 'Status must be either present or absent'})
    }),
    participationScore: z.number()
        .min(0, 'Participation score cannot be less than 0')
        .max(5, 'Participation score cannot be more than 5')
        .optional(),
    date: z.string().optional(),
    notes: z.string().optional()
});

const updateAttendanceSchema = z.object({
    status: z.enum(['present', 'absent']).optional(),
    participationScore: z.number()
        .min(0, 'Participation score cannot be less than 0')
        .max(5, 'Participation score cannot be more than 5')
        .optional(),
    notes: z.string().optional()
});

const getAttendanceQuerySchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z.enum(['present', 'absent']).optional()
});

module.exports = {
    markAttendanceSchema,
    updateAttendanceSchema,
    getAttendanceQuerySchema
};
//done