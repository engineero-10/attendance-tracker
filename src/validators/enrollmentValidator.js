 const {z} = require('zod');

const enrollmentSchema = z.object({
    classCode: z.string()
        .nonempty('Class code is required')
        .transform(val => val.toUpperCase())
});

const dropEnrollmentSchema = z.object({
    classId: z.string().nonempty('Class ID is required')
});

module.exports = {
    enrollmentSchema,
    dropEnrollmentSchema
};