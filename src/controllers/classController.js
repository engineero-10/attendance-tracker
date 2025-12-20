 const {
    createClassService,
    getClassByIdService,
    getMyClassesService,
    getAllClassesService,
    updateClassService,
    deleteClassService,
    getClassStudentsService
} = require('../services/classService');

const createClassController = async (req, res, next) => {
    try {
        const teacherId = req.user._id;
        const classData = req.body;

        const newClass = await createClassService(classData, teacherId);

        res.status(201).json({
            message: 'Class created successfully',
            class: newClass
        });
    } catch (error) {
        next(error);
    }
}

const getClassByIdController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const classData = await getClassByIdService(id);

        res.status(200).json({
            class: classData
        });
    } catch (error) {
        next(error);
    }
}

const getMyClassesController = async (req, res, next) => {
    try {
        const teacherId = req.user._id;
        const classes = await getMyClassesService(teacherId);

        res.status(200).json({
            message: classes.length === 0 ? 'You have no classes yet' : null,
            count: classes.length,
            classes
        });
    } catch (error) {
        next(error);
    }
}

const getAllClassesController = async (req, res, next) => {
    try {
        const classes = await getAllClassesService();

        res.status(200).json({
            count: classes.length,
            classes
        });
    } catch (error) {
        next(error);
    }
}

const updateClassController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const teacherId = req.user._id;
        const updateData = req.body;

        const updatedClass = await updateClassService(id, updateData, teacherId);

        res.status(200).json({
            message: 'Class updated successfully',
            class: updatedClass
        });
    } catch (error) {
        next(error);
    }
}

const deleteClassController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const teacherId = req.user._id;

        await deleteClassService(id, teacherId);

        res.status(200).json({
            message: 'Class deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}

const getClassStudentsController = async (req, res, next) => {
    try {
        const {id} = req.params;
        const teacherId = req.user._id;

        const students = await getClassStudentsService(id, teacherId);

        res.status(200).json({
            count: students.length,
            students
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createClassController,
    getClassByIdController,
    getMyClassesController,
    getAllClassesController,
    updateClassController,
    deleteClassController,
    getClassStudentsController
};