 const {AppError} = require('../utils/errorHandler');
const {
    createClass,
    findClassById,
    findClassByCode,
    findClassesByTeacher,
    findAllClasses,
    updateClass,
    deleteClass
} = require('../repositories/classRepository');
const {findEnrollmentsByClass} = require('../repositories/enrollmentRepository');

const createClassService = async (classData, teacherId) => {
    // Check if class code already exists
    const existingClass = await findClassByCode(classData.code);
    if (existingClass) {
        throw new AppError('Class code already exists', 409);
    }

    // Create class
    const newClass = await createClass({
        ...classData,
        teacher: teacherId
    });

    return newClass;
}

const getClassByIdService = async (classId) => {
    const classData = await findClassById(classId);
    if (!classData) {
        throw new AppError('Class not found', 404);
    }
    return classData;
}

const getMyClassesService = async (teacherId) => {
    return await findClassesByTeacher(teacherId);
}

const getAllClassesService = async () => {
    return await findAllClasses();
}

const updateClassService = async (classId, updateData, teacherId) => {
    const classData = await findClassById(classId);
    
    if (!classData) {
        throw new AppError('Class not found', 404);
    }

    // Check if user is the teacher of this class
    if (classData.teacher._id.toString() !== teacherId.toString()) {
        throw new AppError('You are not authorized to update this class', 403);
    }

    return await updateClass(classId, updateData);
}

const deleteClassService = async (classId, teacherId) => {
    const classData = await findClassById(classId);
    
    if (!classData) {
        throw new AppError('Class not found', 404);
    }

    // Check if user is the teacher of this class
    if (classData.teacher._id.toString() !== teacherId.toString()) {
        throw new AppError('You are not authorized to delete this class', 403);
    }

    await deleteClass(classId);
    return true;
}

const getClassStudentsService = async (classId, teacherId) => {
    const classData = await findClassById(classId);
    
    if (!classData) {
        throw new AppError('Class not found', 404);
    }

    // Check if user is the teacher of this class
    if (classData.teacher._id.toString() !== teacherId.toString()) {
        throw new AppError('You are not authorized to view this class students', 403);
    }

    return await findEnrollmentsByClass(classId);
}

module.exports = {
    createClassService,
    getClassByIdService,
    getMyClassesService,
    getAllClassesService,
    updateClassService,
    deleteClassService,
    getClassStudentsService
};