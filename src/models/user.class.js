const UnSQL = require('unsql')
const pool = require('../services/db.service')
const { envs } = require('../services/environment.helper')

class User extends UnSQL {

    static POOL = pool
    static TABLE_NAME = envs.tables.user

}

module.exports = { User }