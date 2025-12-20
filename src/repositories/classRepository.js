 const {classModel} = require('../models/classModel');

async function createClass(classData) {
    return await classModel.create(classData);
}

async function findClassById(classId) {
    return await classModel.findById(classId).populate('teacher', 'username fullName email');
}

async function findClassByCode(code) {
    return await classModel.findOne({code: code.toUpperCase()});
}

async function findClassesByTeacher(teacherId) {
    return await classModel.find({teacher: teacherId}).sort({createdAt: -1});
}

async function findAllClasses() {
    return await classModel.find({isActive: true})
        .populate('teacher', 'username fullName email')
        .sort({createdAt: -1});
}

async function updateClass(classId, updateData) {
    return await classModel.findByIdAndUpdate(
        classId,
        updateData,
        {new: true, runValidators: true}
    );
}

async function deleteClass(classId) {
    return await classModel.findByIdAndDelete(classId);
}

module.exports = {
    createClass,
    findClassById,
    findClassByCode,
    findClassesByTeacher,
    findAllClasses,
    updateClass,
    deleteClass
};