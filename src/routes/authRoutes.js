// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login, me, changePassword } = require('../controllers/authController'); // <-- phải có changePassword
const { auth } = require('../middleware/auth');

// Tắt self-register trên app
router.post('/register', (_req, res) => {
    return res.status(403).json({ message: 'Self-register is disabled. Contact admin.' });
});

router.post('/login', login);
router.get('/me', auth, me);
router.post('/change-password', auth, changePassword); // <-- nhớ là router.post

module.exports = router;
