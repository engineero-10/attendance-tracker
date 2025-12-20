 const express = require('express');
const attendanceRouter = express.Router();
const {
    markAttendanceController,
    updateAttendanceController,
    getMyAttendanceHistoryController,
    getClassAttendanceSummaryController,
    exportClassAttendanceController,
    getMyAttendanceStatsController
} = require('../controllers/attendanceController');
const {
    markAttendanceSchema,
    updateAttendanceSchema,
    getAttendanceQuerySchema
} = require('../validators/attendanceValidator');
const {validateFactory} = require('../middlewares/validateFactory');
const {isLoggedIn} = require('../middlewares/jwtMiddleware');
const {restrictTo} = require('../middlewares/roleMiddleware');

// POST /attendance/mark - Mark attendance (teacher only)
attendanceRouter.post(
    '/mark',
    isLoggedIn,
    restrictTo('teacher'),
    validateFactory(markAttendanceSchema, 'body'),
    markAttendanceController
);

// PATCH /attendance/:id - Update attendance (teacher only)
attendanceRouter.patch(
    '/:id',
    isLoggedIn,
    restrictTo('teacher'),
    validateFactory(updateAttendanceSchema, 'body'),
    updateAttendanceController
);

// GET /attendance/my - Get student's attendance history
attendanceRouter.get(
    '/my',
    isLoggedIn,
    restrictTo('student'),
    validateFactory(getAttendanceQuerySchema, 'query'),
    getMyAttendanceHistoryController
);

// GET /attendance/my/stats - Get student's attendance statistics
attendanceRouter.get(
    '/my/stats',
    isLoggedIn,
    restrictTo('student'),
    getMyAttendanceStatsController
);

// GET /attendance/class/:classId - Get class attendance summary
attendanceRouter.get(
    '/class/:classId',
    isLoggedIn,
    restrictTo('teacher'),
    getClassAttendanceSummaryController
);

// GET /attendance/class/:classId/export - Export class attendance (JSON)
attendanceRouter.get(
    '/class/:classId/export',
    isLoggedIn,
    restrictTo('teacher'),
    exportClassAttendanceController
);

module.exports = {attendanceRouter};