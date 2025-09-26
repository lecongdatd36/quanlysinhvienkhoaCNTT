// LỚP TRUY CẬP DB (REPO) – CHỈ LÀM VIỆC VỚI CÂU SQL
const { q } = require('../db/pool');

/**
 * Tạo một log điểm danh.
 * - Trả về row nếu INSERT thành công
 * - Trả về null nếu vi phạm UNIQUE (đã có log trong ngày/hoạt động)
 */
const create = async ({ activityId, studentId, method, status, checkedBy }) => {
  const { rows } = await q(
    `INSERT INTO attendance_logs (activity_id, student_id, method, status, checked_by)
   VALUES ($1,$2,$3,$4,$5)
   ON CONFLICT (activity_id, student_id) DO NOTHING
   RETURNING *`,
    [activityId, studentId, method || 'MANUAL', status || 'PRESENT', checkedBy || null]
  );
  return rows[0] || null;
};

/**
 * Danh sách log điểm danh theo activity (ADMIN/STAFF dùng)
 */
const listByActivity = async (activityId) => {
  const { rows } = await q(
    `SELECT al.id,
            al.student_id,
            u.name,
            u.email,
            al.method,
            al.status,
            al.checked_at,
            al.checked_by
       FROM attendance_logs al
       JOIN users u ON u.id = al.student_id
      WHERE al.activity_id = $1
      ORDER BY al.checked_at DESC`,
    [activityId]
  );
  return rows;
};

/**
 * Lịch sử điểm danh của chính sinh viên
 */
const myAttendance = async (studentId) => {
  const { rows } = await q(
    `SELECT al.id,
            al.activity_id,
            a.title,
            al.status,
            al.method,
            al.checked_at
       FROM attendance_logs al
       JOIN activities a ON a.id = al.activity_id
      WHERE al.student_id = $1
      ORDER BY al.checked_at DESC`,
    [studentId]
  );
  return rows;
};

module.exports = { create, listByActivity, myAttendance };
