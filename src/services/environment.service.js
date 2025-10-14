/**
 * Environment variables
 * @constant envs
 * @description stores all environment variables from all .env files, provides easy access to all in a unified interface 'envs' to access them in 'read-only' mode
 * @readonly
 */
const envs = Object.freeze({

    port: process.env.PORT || 5800,

    mode: process.env.NODE_ENV || "dev", // dev | stage | prod

    use_cluster_module: process.env.USE_CLUSTER_MODULE,

    salt_rounds: parseInt(process.env.SALT_ROUNDS) || 10,

    open_api: {
        doc_mode: process.env.OPEN_API_DOC_MODE || "false",
    },

    jwt: {
        accessor_secret: process.env.JWT_ACCESSOR_SECRET,
        refresher_secret: process.env.JWT_REFRESHER_SECRET,
        refresher_ttl: process.env.JWT_REFRESHER_TTL || '90',
        accessor_ttl: process.env.JWT_ACCESSOR_TTL || '15m',
    },

    // DB Credentials
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        name: process.env.DB_NAME,
        connection_limit: process.env.DB_CONNECTION_LIMIT,
        //port: process.env.DB_PORT, // (Optional)
    },

    // DB Tables
    tables: {
        super: {
            account: process.env.DB_TABLE_SUPER_ADMINS,
            mfa: process.env.DB_TABLE_SUPER_ADMIN_MFA_TOKENS,
        },
        user: {
            account: process.env.DB_TABLE_USERS,
            mfa: process.env.DB_TABLE_USER_MFA_TOKENS,
        }
    },

    // AWS Credentials
    aws: {
        s3: {
            region: process.env.AWS_REGION,
            bucket_name: process.env.AWS_S3_BUCKET_NAME,
            user: {

                get: {
                    access_key_id: process.env.AWS_S3_BUCKET_GET_ACCESS_KEY_ID,
                    secret_access_key: process.env.AWS_S3_BUCKET_GET_SECRET_ACCESS_KEY
                },
                put: {
                    access_key_id: process.env.AWS_S3_BUCKET_PUT_ACCESS_KEY_ID,
                    secret_access_key: process.env.AWS_S3_BUCKET_PUT_SECRET_ACCESS_KEY
                },
                delete: {
                    access_key_id: process.env.AWS_S3_BUCKET_DELETE_ACCESS_KEY_ID,
                    secret_access_key: process.env.AWS_S3_BUCKET_DELETE_SECRET_ACCESS_KEY
                },
                all: {
                    access_key_id: process.env.AWS_S3_BUCKET_ALL_ACCESS_KEY_ID,
                    secret_access_key: process.env.AWS_S3_BUCKET_ALL_SECRET_ACCESS_KEY
                }
            },
        },
        sqs: {
            region: process.env.AWS_SQS_REGION,
            user: {
                access_key_id: process.env.AWS_SQS_USER_ACCESS_KEY,
                secret_access_key: process.env.AWS_SQS_USER_SECRET_ACCESS_KEY
            }
        },
        sns: {
            region: process.env.AWS_SNS_REGION,
            user: {
                access_key_id: process.env.AWS_SNS_USER_ACCESS_KEY,
                secret_access_key: process.env.AWS_SNS_USER_SECRET_ACCESS_KEY
            }
        },
        cloudfront: {
            cdn_url: process.env.AWS_CLOUD_FRONT_CDN_URL
        }
    }
})

module.exports = { envs }