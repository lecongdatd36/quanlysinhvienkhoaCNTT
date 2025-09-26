// src/repositories/registrationRepo.js
const { q } = require('../db/pool');

const upsertApproved = async ({ activityId, userId }) => {
  const { rows } = await q(
    `INSERT INTO registrations (activity_id, user_id, status)
     VALUES ($1,$2,'APPROVED')
     ON CONFLICT (activity_id, user_id) DO UPDATE SET status='APPROVED'
     RETURNING *`,
    [activityId, userId]
  );
  return rows[0];
};
const create = async ({ activityId, studentId, status = 'APPROVED' }) => {
  const { rows } = await q(
    `INSERT INTO registrations (activity_id, student_id, status)
     VALUES ($1,$2,$3)
     ON CONFLICT (activity_id, student_id) DO NOTHING
     RETURNING *`,
    [activityId, studentId, status]
  );
  return rows[0] || null; // null = đã đăng ký trước đó
};

const remove = async ({ activityId, studentId }) => {
  const { rowCount } = await q(
    `DELETE FROM registrations WHERE activity_id=$1 AND student_id=$2`,
    [activityId, studentId]
  );
  return rowCount > 0;
};

const findOne = async ({ activityId, studentId }) => {
  const { rows } = await q(
    `SELECT * FROM registrations WHERE activity_id=$1 AND student_id=$2`,
    [activityId, studentId]
  );
  return rows[0] || null;
};

const countApproved = async (activityId) => {
  const { rows } = await q(
    `SELECT COUNT(*)::int AS n FROM registrations
      WHERE activity_id=$1 AND status='APPROVED'`,
    [activityId]
  );
  return rows[0]?.n || 0;
};

const listByActivity = async (activityId) => {
  const { rows } = await q(
    `SELECT r.id, u.id AS student_id, u.name, u.email, u.student_code,
            r.status, r.registered_at
       FROM registrations r
       JOIN users u ON u.id = r.student_id
      WHERE r.activity_id=$1
      ORDER BY r.registered_at DESC`,
    [activityId]
  );
  return rows;
};
const listByUserId = async (studentId) => {
  const sql = `
    SELECT
      r.id,
      r.student_id,
      r.activity_id,
      r.status,
      r.registered_at,
      r.created_at,
      r.updated_at,
      a.title        AS activity_title,   -- nếu bảng activities có 'title'
      a.start_at     AS activity_start,   -- đổi từ start_time -> start_at
      a.end_at       AS activity_end      -- tương ứng end_at
    FROM public.registrations r
    JOIN public.activities a ON a.id = r.activity_id
    WHERE r.student_id = $1
    ORDER BY r.id DESC
  `;
  const { rows } = await q(sql, [studentId]);
  return rows;
};

module.exports = { upsertApproved, create, remove, findOne, countApproved, listByActivity, listByUserId };
