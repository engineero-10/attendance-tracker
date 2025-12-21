 const {AppError} = require('../utils/errorHandler');
const {findClassById} = require('../repositories/classRepository');
const {findEnrollmentByStudentAndClass} = require('../repositories/enrollmentRepository');
const {
    createAttendance,
    findAttendanceByClassAndStudentAndDate,
    findAttendancesByStudent,
    findAttendancesByClass,
    updateAttendance,
    getAttendanceStats
} = require('../repositories/attendanceRepository');

const markAttendanceService = async (attendanceData, teacherId) => {
    const {classId, studentId, status, participationScore, date, notes} = attendanceData;

    // Verify class exists and teacher owns it
    const classData = await findClassById(classId);
    if (!classData) {
        throw new AppError('Class not found', 404);
    }

    if (classData.teacher._id.toString() !== teacherId.toString()) {
        throw new AppError('You are not authorized to mark attendance for this class', 403);
    }

    // Verify student is enrolled in the class
    const enrollment = await findEnrollmentByStudentAndClass(studentId, classId);
    if (!enrollment || enrollment.status !== 'active') {
        throw new AppError('Student is not enrolled in this class', 400);
    }

    // Check if attendance already exists for this date
    const attendanceDate = date ? new Date(date) : new Date();
    const existingAttendance = await findAttendanceByClassAndStudentAndDate(
        classId,
        studentId,
        attendanceDate
    );

    if (existingAttendance) {
        throw new AppError('Attendance already marked for this student on this date', 409);
    }

    // Create attendance record
    return await createAttendance({
        class: classId,
        student: studentId,
        date: attendanceDate,
        status,
        participationScore: participationScore || 0,
        markedBy: teacherId,
        notes
    });
}

const updateAttendanceService = async (attendanceId, updateData, teacherId) => {
    const attendance = await findAttendancesByClass(attendanceId);
    
    if (!attendance) {
        throw new AppError('Attendance record not found', 404);
    }

    // Verify teacher owns the class
    const classData = await findClassById(attendance.class);
    if (classData.teacher._id.toString() !== teacherId.toString()) {
        throw new AppError('You are not authorized to update this attendance', 403);
    }

    return await updateAttendance(attendanceId, updateData);
}

const getStudentAttendanceHistoryService = async (studentId, filters) => {
    return await findAttendancesByStudent(studentId, filters);
}

const getClassAttendanceSummaryService = async (classId, date, teacherId) => {
    // Verify class exists and teacher owns it
    const classData = await findClassById(classId);
    if (!classData) {
        throw new AppError('Class not found', 404);
    }

    if (teacherId && classData.teacher._id.toString() !== teacherId.toString()) {
        throw new AppError('You are not authorized to view this class attendance', 403);
    }

    return await findAttendancesByClass(classId, date);
}

const exportClassAttendanceService = async (classId, teacherId) => {
    // Verify class exists and teacher owns it
    const classData = await findClassById(classId);
    if (!classData) {
        throw new AppError('Class not found', 404);
    }

    if (classData.teacher._id.toString() !== teacherId.toString()) {
        throw new AppError('You are not authorized to export this class attendance', 403);
    }

    // Get all attendance records for this class
    const attendanceRecords = await findAttendancesByClass(classId);

    // Format data for export
    const exportData = {
        class: {
            name: classData.name,
            code: classData.code,
            teacher: classData.teacher.fullName
        },
        exportDate: new Date(),
        totalRecords: attendanceRecords.length,
        records: attendanceRecords.map(record => ({
            studentName: record.student.fullName,
            studentEmail: record.student.email,
            date: record.date,
            status: record.status,
            participationScore: record.participationScore,
            notes: record.notes,
            markedBy: record.markedBy.fullName,
            markedAt: record.createdAt
        }))
    };

    return exportData;
}

const getMyAttendanceStatsService = async (studentId) => {
    const stats = await getAttendanceStats(studentId);
    
    if (stats.length === 0) {
        return {
            totalClasses: 0,
            present: 0,
            absent: 0,
            attendanceRate: 0,
            avgParticipation: 0
        };
    }

    const data = stats[0];
    return {
        totalClasses: data.totalClasses,
        present: data.present,
        absent: data.absent,
        attendanceRate: ((data.present / data.totalClasses) * 100).toFixed(2),
        avgParticipation: data.avgParticipation ? data.avgParticipation.toFixed(2) : 0
    };
}

module.exports = {
    markAttendanceService,
    updateAttendanceService,
    getStudentAttendanceHistoryService,
    getClassAttendanceSummaryService,
    exportClassAttendanceService,
    getMyAttendanceStatsService
};