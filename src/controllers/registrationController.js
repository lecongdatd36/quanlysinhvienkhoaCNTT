const Service = require('../services/registrationService');
const RegistrationRepo = require('../repositories/registrationRepo');
// SV đăng ký: POST /activities/:id/register
exports.register = async (req, res, next) => {
  try {
    const activityId = Number(req.params.id);
    const row = await Service.register({ activityId, studentId: req.user.id });
    res.json(row);
  } catch (e) { next(e); }
};

// SV hủy đăng ký: DELETE /activities/:id/register
exports.unregister = async (req, res, next) => {
  try {
    const activityId = Number(req.params.id);
    const result = await Service.unregister({ activityId, studentId: req.user.id });
    res.json(result);
  } catch (e) { next(e); }
};

// ADMIN/STAFF xem danh sách đăng ký: GET /activities/:id/registrations
exports.listByActivity = async (req, res, next) => {
  try {
    const activityId = Number(req.params.id);
    const rows = await Service.listByActivity(activityId);
    res.json(rows);
  } catch (e) { next(e); }
};
exports.me = async (req, res, next) => {
  try {
    const studentId = req.user.student_id ?? req.user.id; // tuỳ middleware
    const regs = await RegistrationRepo.listByUserId(studentId);
    res.json(regs);
  } catch (err) {
    next(err);
  }
};