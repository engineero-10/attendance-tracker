 const {userModel} = require('../models/userModel');

async function findUserById(userId, includePassword = false) {
    if (includePassword) {
        return await userModel.findById(userId).select("+password");
    }
    return await userModel.findById(userId);
}

async function findUserByUsername(username, includePassword = false) {
    if (includePassword) {
        return await userModel.findOne({username}).select("+password");
    }
    return await userModel.findOne({username});
}

async function findUserByEmail(email) {
    return await userModel.findOne({email});
}
async function createUser(userData) {
    return await userModel.create(userData);
}

async function findUsersByRole(role) {
    return await userModel.find({role});
}

async function findStudentsByIds(studentIds) {
    return await userModel.find({
        _id: {$in: studentIds},
        role: 'student'
    });
}

module.exports = {
    findUserById,
    findUserByUsername,
    findUserByEmail,
    createUser,
    findUsersByRole,
    findStudentsByIds
};