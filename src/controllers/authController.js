// src/controllers/authController.js
const Auth = require('../services/authService');
const { findPublicById } = require('../repositories/userRepo');

// const register = async (req, res, next) => {
//     try {
//         const result = await Auth.register(req.body);
//         res.json(result);
//     } catch (err) {
//         next(err);
//     }
// };

const login = async (req, res, next) => {
    try {
        const result = await Auth.login(req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const me = async (req, res, next) => {
    try {
        const user = await findPublicById(req.user.id);
        res.json(user);
    } catch (err) {
        next(err);
    }
};
const changePassword = async (req, res, next) => {
  try {
    await Auth.changePassword({
      userId: req.user.id,
      oldPassword: req.body.old_password,
      newPassword: req.body.new_password
    });
    res.json({ ok: true });
  } catch (err) { next(err); }
};


module.exports = {  login, me, changePassword };
