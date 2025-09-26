// ROUTES – KHAI BÁO ĐƯỜNG DẪN API CHO ĐIỂM DANH
const router = require('express').Router();
const Ctrl = require('../controllers/attendanceController');
const { auth, requireRole } = require('../middleware/auth');

// SV/ADMIN/STAFF: điểm danh (SV tự điểm danh; ADMIN/STAFF có thể điểm danh hộ)
router.post('/:activityId/checkin', auth, Ctrl.checkin);

// SV: xem lịch sử điểm danh của chính mình
router.get('/me', auth, Ctrl.myAttendance);

// ADMIN/STAFF: xem danh sách điểm danh theo hoạt động
router.get('/activity/:id', auth, requireRole('ADMIN', 'STAFF'), Ctrl.listByActivity);

module.exports = router;
