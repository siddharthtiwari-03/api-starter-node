const UnSQL = require('unsql')
const pool = require('../services/db.service')
const table_name = process.env.DB_TABLE_USERS

class User extends UnSQL {

    static POOL = pool
    static TABLE_NAME = table_name

}

module.exports = User