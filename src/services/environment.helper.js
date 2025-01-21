/**
 * @module
 */

/**
 * holds environment variables
 * @type {object}
 */
const envs = Object.freeze({
    port: process.env.PORT,
    use_cluster_module: process.env.USE_CLUSTER_MODULE,

    // DB Creds
    db_host: process.env.DB_HOST,
    db_user: process.env.DB_USER,
    db_pass: process.env.DB_PASS,
    db_name: process.env.DB_NAME,
    db_connection_pool_limit: process.env.DB_CONNECTION_POOL_LIMIT,
    // db_port: process.env.DB_PORT, // (Optional)
    
    // DB Tables
    db_table_users: process.env.DB_TABLE_USERS,
})

module.exports = { envs }