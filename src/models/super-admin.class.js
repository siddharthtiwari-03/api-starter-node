// @ts-check
const { UnSQL } = require('unsql')

// get connection pool from your mysql provider service
const pool = require('../services/db.service')
const { envs } = require('../services/environment.service')


/**
 * @class Super Admin
 * @extends UnSQL
 */
class SuperAdmin extends UnSQL {

    /**
     * UnSQL config
     * @type {UnSQL.config}
     */
    static config = {
        table: envs.tables.super.account || '', // (mandatory) replace this with your table name
        pool, // replace 'pool' with 'connection' if you wish to use single connection instead of connection pool
        safeMode: true,
        devMode: false,
        dialect: 'mysql'
    }

}

module.exports = { SuperAdmin }