const ActivityRepo = require('../repositories/activityRepo');
const RegRepo = require('../repositories/registrationRepo');

const register = async ({ activityId, studentId }) => {
  const act = await ActivityRepo.getById(activityId);
  if (!act) { const e = new Error('Hoạt động không tồn tại'); e.status = 404; throw e; }
  if (act.status !== 'PUBLISHED') { const e = new Error('Hoạt động chưa mở hoặc đã đóng'); e.status = 400; throw e; }

  // (tuỳ chọn) chặn đăng ký sau khi kết thúc
  if (act.end_at && new Date(act.end_at) < new Date()) {
    const e = new Error('Hoạt động đã kết thúc'); e.status = 400; throw e;
  }

  // kiểm tra hết chỗ
  if (act.max_slots && Number(act.max_slots) > 0) {
    const current = await RegRepo.countApproved(activityId);
    if (current >= Number(act.max_slots)) {
      const e = new Error('Hoạt động đã đủ chỗ'); e.status = 400; throw e;
    }
  }

  const existed = await RegRepo.findOne({ activityId, studentId });
  if (existed) { const e = new Error('Bạn đã đăng ký hoạt động này'); e.status = 400; throw e; }

  const row = await RegRepo.create({ activityId, studentId });
  return row;
};

const unregister = async ({ activityId, studentId }) => {
  const ok = await RegRepo.remove({ activityId, studentId });
  if (!ok) { const e = new Error('Bạn chưa đăng ký hoạt động này'); e.status = 400; throw e; }
  return { ok: true };
};

const listByActivity = (activityId) => RegRepo.listByActivity(activityId);

module.exports = { register, unregister, listByActivity };
