const express = require('express');
const app = express();

const {authRouter} = require('./routes/authRoutes');
const {classRouter} = require('./routes/classRoutes');
const {studentRouter} = require('./routes/studentRoutes');
const {attendanceRouter} = require('./routes/attendanceRoutes');

app.use(express.json());

app.use('/auth', authRouter);
app.use('/classes', classRouter);
app.use('/students', studentRouter);
app.use('/attendance', attendanceRouter);

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome Attendance Tracker',
        version: '1.0.0',
        status: 'active'
    });
});

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Route not found',
        data: null
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    const code = err.code || 500;
    const message = err.message || 'Internal server error';
    const data = err.data || null;
    
    res.status(code).json({
        message: message,
        data: data
    });
});

module.exports = {app};