const UnSQL = require('unsql')
const pool = require('../services/db.service')
const table_name = process.env.DB_TABLE_HOTELS

class Hotel extends UnSQL {

    static POOL = pool
    static TABLE_NAME = table_name

}

module.exports = Hotel