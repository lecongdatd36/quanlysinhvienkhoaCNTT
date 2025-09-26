// src/repositories/activityRepo.js
const { q } = require('../db/pool');

const create = async (payload) => {
    const { title, description, start_at, end_at, location, max_slots, status, created_by } = payload;
    const { rows } = await q(
        `INSERT INTO activities (title, description, start_at, end_at, location, max_slots, status, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
        [title, description, start_at, end_at, location, max_slots, status, created_by]
    );
    return rows[0];
};

const update = async (id, payload) => {
    const { title, description, start_at, end_at, location, max_slots, status } = payload;
    const { rows } = await q(
        `UPDATE activities
       SET title=$2,
           description=$3,
           start_at=$4,
           end_at=$5,
           location=$6,
           max_slots=$7,
           status=$8,
           updated_at=NOW()
     WHERE id=$1
     RETURNING *`,
        [id, title, description, start_at, end_at, location, max_slots, status]
    );
    return rows[0];
};

const destroy = async (id) => {
    await q('DELETE FROM registrations WHERE activity_id=$1', [id]); // nếu có bảng đăng ký
    const { rowCount } = await q('DELETE FROM activities WHERE id=$1', [id]);
    return rowCount > 0;
};

const getById = async (id) => {
    const { rows } = await q('SELECT * FROM activities WHERE id=$1', [id]);
    return rows[0];
};

const listForManage = async ({ createdBy, isAdmin, status }) => {
    if (isAdmin) {
        const sql = status
            ? 'SELECT * FROM activities WHERE status=$1 ORDER BY created_at DESC'
            : 'SELECT * FROM activities ORDER BY created_at DESC';
        const params = status ? [status] : [];
        const { rows } = await q(sql, params);
        return rows;
    } else {
        const sql = status
            ? 'SELECT * FROM activities WHERE created_by=$1 AND status=$2 ORDER BY created_at DESC'
            : 'SELECT * FROM activities WHERE created_by=$1 ORDER BY created_at DESC';
        const params = status ? [createdBy, status] : [createdBy];
        const { rows } = await q(sql, params);
        return rows;
    }
};

const updateStatus = async (id, status) => {
    const { rows } = await q(
        `UPDATE activities
       SET status=$2, updated_at=NOW()
     WHERE id=$1
     RETURNING *`,
        [id, status]
    );
    return rows[0];
};

/* Hàm lấy danh sách hoạt động public */
const listPublished = async () => {
    const { rows } = await q(
        `SELECT id, title, description, start_at, end_at, location, max_slots, status
     FROM activities
     WHERE status = 'PUBLISHED'
     ORDER BY start_at DESC`
    );
    return rows;
};

module.exports = {
    create,
    update,
    destroy,
    getById,
    listForManage,
    updateStatus,
    listPublished,
};
