 const {attendanceModel} = require('../models/attendanceModel');

async function createAttendance(attendanceData) {
    return await attendanceModel.create(attendanceData);
}

async function findAttendanceById(attendanceId) {
    return await attendanceModel.findById(attendanceId)
        .populate('student', 'username fullName email')
        .populate('class', 'name code')
        .populate('markedBy', 'username fullName');
}

async function findAttendanceByClassAndStudentAndDate(classId, studentId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return await attendanceModel.findOne({
        class: classId,
        student: studentId,
        date: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });
}

async function findAttendancesByStudent(studentId, filters = {}) {
    const query = {student: studentId};
    
    if (filters.startDate || filters.endDate) {
        query.date = {};
        if (filters.startDate) query.date.$gte = new Date(filters.startDate);
        if (filters.endDate) query.date.$lte = new Date(filters.endDate);
    }
    
    if (filters.status) {
        query.status = filters.status;
    }
    
    return await attendanceModel.find(query)
        .populate('class', 'name code')
        .populate('markedBy', 'username fullName')
        .sort({date: -1});
}

async function findAttendancesByClass(classId, date = null) {
    const query = {class: classId};
    
    if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        query.date = {
            $gte: startOfDay,
            $lte: endOfDay
        };
    }
    
    return await attendanceModel.find(query)
        .populate('student', 'username fullName email')
        .populate('markedBy', 'username fullName')
        .sort({date: -1});
}

async function updateAttendance(attendanceId, updateData) {
    return await attendanceModel.findByIdAndUpdate(
        attendanceId,
        updateData,
        {new: true, runValidators: true}
    );
}

async function deleteAttendance(attendanceId) {
    return await attendanceModel.findByIdAndDelete(attendanceId);
}

async function getAttendanceStats(studentId, classId = null) {
    const matchStage = {student: studentId};
    if (classId) matchStage.class = classId;
    
    return await attendanceModel.aggregate([
        {$match: matchStage},
        {
            $group: {
                _id: null,
                totalClasses: {$sum: 1},
                present: {
                    $sum: {$cond: [{$eq: ['$status', 'present']}, 1, 0]}
                },
                absent: {
                    $sum: {$cond: [{$eq: ['$status', 'absent']}, 1, 0]}
                },
                avgParticipation: {$avg: '$participationScore'}
            }
        }
    ]);
}

module.exports = {
    createAttendance,
    findAttendanceById,
    findAttendanceByClassAndStudentAndDate,
    findAttendancesByStudent,
    findAttendancesByClass,
    updateAttendance,
    deleteAttendance,
    getAttendanceStats
};