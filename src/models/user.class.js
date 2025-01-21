const UnSQL = require('unsql')
const pool = require('../services/db.service')
const { envs } = require('../services/environment.helper')

const table_name = envs.tables.user

class User extends UnSQL {

    static POOL = pool
    static TABLE_NAME = table_name

}

module.exports = User