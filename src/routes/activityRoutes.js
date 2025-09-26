// src/routes/activityRoutes.js
const express = require('express');
const router = express.Router();
const ActivityCtrl = require('../controllers/activityController');
const { auth, requireRole } = require('../middleware/auth');

// Xem hoạt động đã công bố (public)
router.get('/', ActivityCtrl.listPublished);

// Tạo hoạt động (STAFF/ADMIN)
router.post('/', auth, requireRole('STAFF', 'ADMIN'), ActivityCtrl.create);

// Sinh viên đăng ký tham gia
router.post('/:id/register', auth, requireRole('STUDENT'), ActivityCtrl.register);

module.exports = router;
