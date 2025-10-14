const mysql = require('mysql2/promise')
const { envs } = require('./environment.service')

const pool = mysql.createPool({
    host: envs.db.host,
    user: envs.db.user,
    password: envs.db.pass,
    database: envs.db.name,
    connectionLimit: envs.db.connection_limit,
    waitForConnections: true,
    queueLimit: 100,
    connectTimeout: 10000,
    insecureAuth: true
})

module.exports = pool