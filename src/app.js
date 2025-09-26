const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/error');

// routes
const authRoutes = require('./routes/authRoutes');
const activityRoutes = require('./routes/activityRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const activityManageRoutes = require('./routes/activityManageRoutes');
const app = express();
const registrationRoutes = require('./routes/registrationRoutes');
app.use(cors());
app.use(express.json());

// health check
app.get('/', (req, res) => res.json({ ok: true }));
app.use('/', registrationRoutes);
app.use('/auth', authRoutes);
app.use('/activities', activityRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/admin/activities', activityManageRoutes);
app.use(errorHandler);
app.use('/registrations', require('./routes/registrationRoutes'));

module.exports = app;
