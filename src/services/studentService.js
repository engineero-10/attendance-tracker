 const {AppError} = require('../utils/errorHandler');
const {findClassByCode} = require('../repositories/classRepository');
const {
    createEnrollment,
    findEnrollmentByStudentAndClass,
    findEnrollmentsByStudent,
    updateEnrollmentStatus
} = require('../repositories/enrollmentRepository');

const enrollInClassService = async (classCode, studentId) => {
    // Find class by code
    const classData = await findClassByCode(classCode);
    if (!classData) {
        throw new AppError('Class not found with this code', 404);
    }

    if (!classData.isActive) {
        throw new AppError('This class is not accepting enrollments', 400);
    }

    // Check if already enrolled
    const existingEnrollment = await findEnrollmentByStudentAndClass(
        studentId,
        classData._id
    );

    if (existingEnrollment) {
        if (existingEnrollment.status === 'active') {
            throw new AppError('You are already enrolled in this class', 409);
        } else {
            // Reactivate enrollment
            return await updateEnrollmentStatus(existingEnrollment._id, 'active');
        }
    }

    // Create enrollment
    return await createEnrollment(studentId, classData._id);
}

const getMyEnrollmentsService = async (studentId) => {
    return await findEnrollmentsByStudent(studentId);
}

const dropClassService = async (classId, studentId) => {
    const enrollment = await findEnrollmentByStudentAndClass(studentId, classId);
    
    if (!enrollment) {
        throw new AppError('You are not enrolled in this class', 404);
    }

    if (enrollment.status !== 'active') {
        throw new AppError('This enrollment is not active', 400);
    }

    return await updateEnrollmentStatus(enrollment._id, 'dropped');
}

module.exports = {
    enrollInClassService,
    getMyEnrollmentsService,
    dropClassService
};