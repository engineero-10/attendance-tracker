 const {
    markAttendanceService,
    updateAttendanceService,
    getStudentAttendanceHistoryService,
    getClassAttendanceSummaryService,
    exportClassAttendanceService,
    getMyAttendanceStatsService
} = require('../services/attendanceService');

const markAttendanceController = async (req, res, next) => {
    try {
        const teacherId = req.user._id;
        const attendanceData = req.body;

        const attendance = await markAttendanceService(attendanceData, teacherId);

        res.status(201).json({
            message: 'Attendance marked successfully',
            attendance
        });
    } catch (error) {
        next(error);
    }
}

const updateAttendanceController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const teacherId = req.user._id;
        const updateData = req.body;

        const attendance = await updateAttendanceService(id, updateData, teacherId);

        res.status(200).json({
            message: 'Attendance updated successfully',
            attendance
        });
    } catch (error) {
        next(error);
    }
}

const getMyAttendanceHistoryController = async (req, res, next) => {
    try {
        const studentId = req.user._id;
        const filters = req.query;

        const attendance = await getStudentAttendanceHistoryService(studentId, filters);

        res.status(200).json({
            message: attendance.length === 0 ? 'No attendance records found' : null,
            count: attendance.length,
            attendance
        });
    } catch (error) {
        next(error);
    }
}

const getClassAttendanceSummaryController = async (req, res, next) => {
    try {
        const {classId} = req.params;
        const {date} = req.query;
        const teacherId = req.user.role === 'teacher' ? req.user._id : null;

        const attendance = await getClassAttendanceSummaryService(classId, date, teacherId);

        res.status(200).json({
            count: attendance.length,
            date: date || 'All dates',
            attendance
        });
    } catch (error) {
        next(error);
    }
}

const exportClassAttendanceController = async (req, res, next) => {
    try {
        const {classId} = req.params;
        const teacherId = req.user._id;

        const exportData = await exportClassAttendanceService(classId, teacherId);

        res.status(200).json({
            message: 'Attendance exported successfully',
            data: exportData
        });
    } catch (error) {
        next(error);
    }
}

const getMyAttendanceStatsController = async (req, res, next) => {
    try {
        const studentId = req.user._id;

        const stats = await getMyAttendanceStatsService(studentId);

        res.status(200).json({
            stats
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    markAttendanceController,
    updateAttendanceController,
    getMyAttendanceHistoryController,
    getClassAttendanceSummaryController,
    exportClassAttendanceController,
    getMyAttendanceStatsController
};