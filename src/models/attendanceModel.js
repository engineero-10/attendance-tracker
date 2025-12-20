 const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class',
        required: [true, 'Class is required']
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student is required']
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now
    },
    status: {
        type: String,
        enum: ['present', 'absent'],
        required: [true, 'Attendance status is required']
    },
    participationScore: {
        type: Number,
        min: [0, 'Participation score cannot be less than 0'],
        max: [5, 'Participation score cannot be more than 5'],
        default: 0
    },
    markedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Teacher who marked is required']
    },
    notes: {
        type: String,
        trim: true
    }
}, {timestamps: true});

attendanceSchema.index({
    class: 1,
    student: 1,
    date: 1
}, {
    unique: true,
    partialFilterExpression: {
        date: {$type: 'date'}
    }
});

attendanceSchema.index({class: 1, date: 1});
attendanceSchema.index({student: 1});

attendanceSchema.methods.getDateOnly = function() {
    const d = new Date(this.date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const attendanceModel = mongoose.model('Attendance', attendanceSchema);

module.exports = {attendanceModel};