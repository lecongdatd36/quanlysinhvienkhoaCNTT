// LỚP NGHIỆP VỤ (SERVICE) – KIỂM TRA LOGIC, GỌI REPO
const AttendanceRepo = require('../repositories/attendanceRepo');
const ActivityRepo = require('../repositories/activityRepo');
// (tuỳ chọn) RegistrationRepo: nếu muốn bắt buộc phải đăng ký mới được điểm danh
// const RegRepo = require('../repositories/registrationRepo');

const checkin = async ({ activityId, studentId, method, status, byUser }) => {
  // 1) Kiểm tra hoạt động tồn tại
  const act = await ActivityRepo.getById(activityId);
  if (!act) {
    const e = new Error('Hoạt động không tồn tại');
    e.status = 404;
    throw e;
  }
  // 2) Chỉ cho điểm danh khi đã công bố
  if (act.status !== 'PUBLISHED') {
    const e = new Error('Hoạt động chưa mở hoặc đã đóng');
    e.status = 400;
    throw e;
  }

  // 3) (Tuỳ chọn) Kiểm tra SV có đăng ký hoạt động này chưa
  // const reg = await RegRepo.findOne(activityId, studentId);
  // if (!reg) {
  //   const e = new Error('Bạn chưa đăng ký hoạt động này');
  //   e.status = 400;
  //   throw e;
  // }

  // 4) Tạo log điểm danh
  const row = await AttendanceRepo.create({
    activityId,
    studentId,
    method,
    status,
    checkedBy: byUser || null, // nếu admin/staff điểm danh hộ
  });

  if (!row) {
    const e = new Error('Hôm nay bạn đã điểm danh hoạt động này');
    e.status = 400;
    throw e;
  }
  return row;
};

const listByActivity = (activityId) => AttendanceRepo.listByActivity(activityId);
const myAttendance = (studentId) => AttendanceRepo.myAttendance(studentId);

module.exports = { checkin, listByActivity, myAttendance };
