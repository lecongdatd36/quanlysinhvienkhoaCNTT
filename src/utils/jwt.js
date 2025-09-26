const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

const sign = (payload, options = { expiresIn: '1d' }) =>
  jwt.sign(payload, jwtSecret, options);

const verify = (token) => jwt.verify(token, jwtSecret);

module.exports = { sign, verify };
