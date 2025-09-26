const { q } = require('../db/pool');

// helper chuẩn hóa email
const normEmail = (e) => String(e || '').trim().toLowerCase();

const createStudent = async ({ name, email, passwordHash, studentCode }) => {
    const { rows } = await q(
        `INSERT INTO users (name, email, password_hash, student_code, role, is_active)
     VALUES ($1, $2, $3, $4, 'STUDENT', TRUE)
     RETURNING id, name, email, role, student_code`,
        [name, normEmail(email), passwordHash, studentCode || null]
    );
    return rows[0];
};

// Dùng cho LOGIN: phải trả password_hash
const findByEmailActive = async (email) => {
    const { rows } = await q(
        `SELECT id, name, email, role, student_code, is_active, password_hash
       FROM users
      WHERE LOWER(email) = $1 AND is_active = TRUE
      LIMIT 1`,
        [normEmail(email)]
    );
    return rows[0];
};

// Dùng cho /auth/me: không trả password_hash
const findPublicById = async (id) => {
    const { rows } = await q(
        `SELECT id, name, email, role, student_code
       FROM users
      WHERE id = $1`,
        [id]
    );
    return rows[0];
};

module.exports = { createStudent, findByEmailActive, findPublicById };
