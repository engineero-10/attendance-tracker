 const express = require('express');
const studentRouter = express.Router();
const {
    enrollInClassController,
    getMyEnrollmentsController,
    dropClassController
} = require('../controllers/studentController');
const {enrollmentSchema, dropEnrollmentSchema} = require('../validators/enrollmentValidator');
const {validateFactory} = require('../middlewares/validateFactory');
const {isLoggedIn} = require('../middlewares/jwtMiddleware');
const {restrictTo} = require('../middlewares/roleMiddleware');

// GET /students/enrollments - Get student's enrollments
studentRouter.get(
    '/enrollments',
    isLoggedIn,
    restrictTo('student'),
    getMyEnrollmentsController
);

// POST /students/enroll - Enroll in a class
studentRouter.post(
    '/enroll',
    isLoggedIn,
    restrictTo('student'),
    validateFactory(enrollmentSchema, 'body'),
    enrollInClassController
);

// POST /students/drop - Drop a class
studentRouter.post(
    '/drop',
    isLoggedIn,
    restrictTo('student'),
    validateFactory(dropEnrollmentSchema, 'body'),
    dropClassController
);

module.exports = {studentRouter};