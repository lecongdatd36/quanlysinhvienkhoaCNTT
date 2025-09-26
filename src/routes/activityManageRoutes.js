const express = require('express');
const router = express.Router();
const Ctrl = require('../controllers/activityManageController');
const { auth, requireRole } = require('../middleware/auth');

// chỉ STAFF/ADMIN
router.use(auth, requireRole('STAFF', 'ADMIN'));

router.get('/', Ctrl.list);                            // GET  /admin/activities?status=DRAFT|PUBLISHED|CLOSED
router.post('/', Ctrl.create);                         // POST /admin/activities
router.put('/:id', Ctrl.update);                       // PUT  /admin/activities/:id
router.patch('/:id/status', Ctrl.updateStatus);        // PATCH /admin/activities/:id/status
router.delete('/:id', Ctrl.destroy);                   // DELETE /admin/activities/:id

module.exports = router;
