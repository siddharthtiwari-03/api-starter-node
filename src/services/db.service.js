import mysql from 'mysql2/promise'
import { envs } from './environment.service.js'

export const pool = mysql.createPool({
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