 const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Class name is required'],
        trim: true,
        minlength: [3, 'Class name must be at least 3 characters']
    },
    code: {
        type: String,
        required: [true, 'Class code is required'],
        unique: true,
        uppercase: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Teacher is required']
    },
    schedule: {
        dayOfWeek: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        startTime: String,
        endTime: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

classSchema.index({teacher: 1});
classSchema.index({code: 1});

const classModel = mongoose.model('Class', classSchema);

module.exports = {classModel};