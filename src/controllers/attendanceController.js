// CONTROLLER – NHẬN REQ, GỌI SERVICE, TRẢ RES
const Service = require('../services/attendanceService');

/**
 * SV tự điểm danh (hoặc ADMIN/STAFF điểm danh hộ nếu có student_id)
 * POST /attendance/:activityId/checkin
 * Body: { method?: 'QR'|'MANUAL'|'PIN'|'OTHER', status?: 'PRESENT'|'LATE'|'ABSENT', student_id?: number }
 */
exports.checkin = async (req, res, next) => {
  try {
    const activityId = Number(req.params.activityId);
    const method = req.body.method || 'MANUAL';
    const status = req.body.status || 'PRESENT';

    // ADMIN/STAFF có quyền điểm danh hộ nếu gửi student_id
    const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'STAFF';
    const studentId = isStaff && req.body.student_id
      ? Number(req.body.student_id)
      : req.user.id;

    const row = await Service.checkin({
      activityId,
      studentId,
      method,
      status,
      byUser: isStaff ? req.user.id : null,
    });
    res.json(row);
  } catch (e) { next(e); }
};

/**
 * ADMIN/STAFF xem danh sách điểm danh theo hoạt động
 * GET /attendance/activity/:id
 */
exports.listByActivity = async (req, res, next) => {
  try {
    const rows = await Service.listByActivity(Number(req.params.id));
    res.json(rows);
  } catch (e) { next(e); }
};

/**
 * SV xem lịch sử điểm danh của mình
 * GET /attendance/me
 */
exports.myAttendance = async (req, res, next) => {
  try {
    const rows = await Service.myAttendance(req.user.id);
    res.json(rows);
  } catch (e) { next(e); }
};
