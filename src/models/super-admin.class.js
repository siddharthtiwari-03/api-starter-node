// @ts-check
import { UnSQL } from 'unsql'

// get connection pool from your mysql provider service
import { pool } from '../services/db.service.js'
import { envs } from '../services/environment.service.js'


/**
 * @extends UnSQL
 */
export class SuperAdmin extends UnSQL {

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