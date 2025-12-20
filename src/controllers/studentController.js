 const {
    enrollInClassService,
    getMyEnrollmentsService,
    dropClassService
} = require('../services/studentService');

const enrollInClassController = async (req, res, next) => {
    try {
        const studentId = req.user._id;
        const {classCode} = req.body;

        const enrollment = await enrollInClassService(classCode, studentId);

        res.status(201).json({
            message: 'Enrolled successfully',
            enrollment
        });
    } catch (error) {
        next(error);
    }
}

const getMyEnrollmentsController = async (req, res, next) => {
    try {
        const studentId = req.user._id;
        const enrollments = await getMyEnrollmentsService(studentId);

        res.status(200).json({
            message: enrollments.length === 0 ? 'You are not enrolled in any classes' : null,
            count: enrollments.length,
            enrollments
        });
    } catch (error) {
        next(error);
    }
}

const dropClassController = async (req, res, next) => {
    try {
        const studentId = req.user._id;
        const {classId} = req.body;

        await dropClassService(classId, studentId);

        res.status(200).json({
            message: 'Class dropped successfully'
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    enrollInClassController,
    getMyEnrollmentsController,
    dropClassController
};