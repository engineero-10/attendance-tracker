 const {enrollmentModel} = require('../models/enrollmentModel');

async function createEnrollment(studentId, classId) {
    return await enrollmentModel.create({
        student: studentId,
        class: classId
    });
}

async function findEnrollmentByStudentAndClass(studentId, classId) {
    return await enrollmentModel.findOne({
        student: studentId,
        class: classId
    });
}

async function findEnrollmentsByStudent(studentId) {
    return await enrollmentModel.find({
        student: studentId,
        status: 'active'
    }).populate('class');
}

async function findEnrollmentsByClass(classId) {
    return await enrollmentModel.find({
        class: classId,
        status: 'active'
    }).populate('student', 'username fullName email');
}

async function updateEnrollmentStatus(enrollmentId, status) {
    return await enrollmentModel.findByIdAndUpdate(
        enrollmentId,
        {status},
        {new: true}
    );
}

async function deleteEnrollment(enrollmentId) {
    return await enrollmentModel.findByIdAndDelete(enrollmentId);
}

async function countEnrollmentsByClass(classId) {
    return await enrollmentModel.countDocuments({
        class: classId,
        status: 'active'
    });
}

module.exports = {
    createEnrollment,
    findEnrollmentByStudentAndClass,
    findEnrollmentsByStudent,
    findEnrollmentsByClass,
    updateEnrollmentStatus,
    deleteEnrollment,
    countEnrollmentsByClass
};