const Pool = require('pg').Pool
const pool = new Pool({
    user : 'postgres',
    password : 'fizmat',
    port : 5432,
    host : 'localhost',
    database : 'tele_bot'
})

module.exports = pool