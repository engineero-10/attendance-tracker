 const express = require('express');
const classRouter = express.Router();
const {
    createClassController,
    getClassByIdController,
    getMyClassesController,
    getAllClassesController,
    updateClassController,
    deleteClassController,
    getClassStudentsController
} = require('../controllers/classController');
const {
    createClassSchema,
    updateClassSchema,
    classIdSchema
} = require('../validators/classValidator');
const {validateFactory} = require('../middlewares/validateFactory');
const {isLoggedIn} = require('../middlewares/jwtMiddleware');
const {restrictTo} = require('../middlewares/roleMiddleware');

// GET /classes - Get all classes (public)
classRouter.get('/', isLoggedIn, getAllClassesController);

// GET /classes/my - Get teacher's classes
classRouter.get('/my', isLoggedIn, restrictTo('teacher'), getMyClassesController);

// POST /classes - Create new class (teacher only)
classRouter.post(
    '/',
    isLoggedIn,
    restrictTo('teacher'),
    validateFactory(createClassSchema, 'body'),
    createClassController
);

// GET /classes/:id - Get class by ID
classRouter.get(
    '/:id',
    isLoggedIn,
    validateFactory(classIdSchema, 'params'),
    getClassByIdController
);

// PATCH /classes/:id - Update class (teacher only)
classRouter.patch(
    '/:id',
    isLoggedIn,
    restrictTo('teacher'),
    validateFactory(classIdSchema, 'params'),
    validateFactory(updateClassSchema, 'body'),
    updateClassController
);

// DELETE /classes/:id - Delete class (teacher only)
classRouter.delete(
    '/:id',
    isLoggedIn,
    restrictTo('teacher'),
    validateFactory(classIdSchema, 'params'),
    deleteClassController
);

// GET /classes/:id/students - Get class students (teacher only)
classRouter.get(
    '/:id/students',
    isLoggedIn,
    restrictTo('teacher'),
    validateFactory(classIdSchema, 'params'),
    getClassStudentsController
);

module.exports = {classRouter};