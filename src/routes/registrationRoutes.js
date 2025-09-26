const router = require('express').Router();
const Ctrl = require('../controllers/registrationController');
const { auth, requireRole } = require('../middleware/auth');

// SV: đăng ký / hủy đăng ký
router.post('/activities/:id/register', auth, Ctrl.register);
router.delete('/activities/:id/register', auth, Ctrl.unregister);

// ADMIN/STAFF: xem danh sách đăng ký theo activity
router.get('/activities/:id/registrations', auth, requireRole('ADMIN','STAFF'), Ctrl.listByActivity);
router.get('/me', auth, Ctrl.me);
module.exports = router;
