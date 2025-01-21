const mysql = require('mysql2/promise')
const { envs } = require('./environment.helper')

const pool = mysql.createPool({
    host: envs.db_host,
    user: envs.db_user,
    password: envs.db_pass,
    database: envs.db_name,
    connectionLimit: envs.db_connection_pool_limit
})

module.exports = pool