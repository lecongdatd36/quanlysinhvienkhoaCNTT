const bcrypt = require('bcrypt');

const hash = (plain) => bcrypt.hash(plain, 10);
const compare = (plain, hashed) => bcrypt.compare(plain, hashed);

module.exports = { hash, compare };
