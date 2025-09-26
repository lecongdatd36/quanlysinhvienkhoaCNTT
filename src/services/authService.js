// src/services/authService.js
const { findByEmailActive } = require('../repositories/userRepo');
const { hash, compare } = require('../utils/hash');
const { sign } = require('../utils/jwt');
const { q } = require('../db/pool');

// =============== LOGIN ===============
const login = async ({ email, password }) => {
    if (!email || !password) {
        const e = new Error('Missing email/password');
        e.status = 400;
        throw e;
    }

    const user = await findByEmailActive(email);
    if (!user) {
        const e = new Error('Sai email hoặc mật khẩu');
        e.status = 400;
        throw e;
    }

    const ok = await compare(password, user.password_hash);
    if (!ok) {
        const e = new Error('Sai email hoặc mật khẩu');
        e.status = 400;
        throw e;
    }

    const token = sign({ id: user.id, role: user.role, name: user.name });
    return {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token,
    };
};

// =========== CHANGE PASSWORD ===========
const changePassword = async ({ userId, oldPassword, newPassword }) => {
    if (!oldPassword || !newPassword) {
        const e = new Error('Thiếu mật khẩu');
        e.status = 400;
        throw e;
    }
    if (newPassword.length < 6) {
        const e = new Error('Mật khẩu mới tối thiểu 6 ký tự');
        e.status = 400;
        throw e;
    }

    // Lấy hash hiện tại
    let rows;
    try {
        ({ rows } = await q(
            'SELECT password_hash FROM users WHERE id=$1 AND is_active=TRUE',
            [userId]
        ));
    } catch (dbErr) {
        console.error('[changePassword] SELECT error:', dbErr);
        dbErr.status = 500;
        throw dbErr;
    }

    const u = rows && rows[0];
    if (!u) {
        const e = new Error('User không tồn tại hoặc đã bị vô hiệu');
        e.status = 400;
        throw e;
    }

    // So sánh mật khẩu cũ
    const ok = await compare(oldPassword, u.password_hash);
    if (!ok) {
        const e = new Error('Mật khẩu cũ không đúng');
        e.status = 400;
        throw e;
    }

    // Cập nhật mật khẩu mới
    const newHash = await hash(newPassword);
    try {
        await q('UPDATE users SET password_hash=$1 WHERE id=$2', [newHash, userId]);
    } catch (dbErr) {
        console.error('[changePassword] UPDATE error:', dbErr);
        dbErr.status = 500;
        throw dbErr;
    }

    return { ok: true };
};

module.exports = { login, changePassword };

