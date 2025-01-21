const mysql = require('mysql2/promise')
const { envs } = require('./environment.helper')

const pool = mysql.createPool({
    host: envs.db.host,
    user: envs.db.user,
    password: envs.db.pass,
    database: envs.db.name,
    connectionLimit: envs.db.connection_limit
})

module.exports = pool