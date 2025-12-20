 const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enrollmentSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student is required']
    },
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class',
        required: [true, 'Class is required']
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'dropped', 'completed'],
        default: 'active'
    }
}, {timestamps: true});

enrollmentSchema.index({student: 1, class: 1}, {unique: true});

enrollmentSchema.index({student: 1});
enrollmentSchema.index({class: 1});

const enrollmentModel = mongoose.model('Enrollment', enrollmentSchema);

module.exports = {enrollmentModel};