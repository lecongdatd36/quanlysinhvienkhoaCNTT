const { Pool } = require('pg');
const { dbUrl } = require('../config/env');

const pool = new Pool({ connectionString: dbUrl });
const q = (text, params) => pool.query(text, params);

module.exports = { pool, q };
