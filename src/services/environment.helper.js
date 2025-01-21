const envs = Object.freeze({
    port: process.env.PORT,
    use_cluster_module: process.env.USE_CLUSTER_MODULE,

    // DB Creds
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        name: process.env.DB_NAME,
        connection_pool_limit: process.env.DB_CONNECTION_POOL_LIMIT,
        //port: process.env.DB_PORT, // (Optional)
    },

    // DB Tables
    tables: {
        user: process.env.DB_TABLE_USERS
    },


    // AWS Creds
    aws: {
        s3: {
            region: process.env.AWS_REGION,
            bucket_name: process.env.AWS_S3_BUCKET_NAME,
            user: {
                access_key_id: process.env.AWS_S3_BUCKET_ACCESS_KEY_ID,
                secret_access_key: process.env.AWS_S3_BUCKET_SECRET_ACCESS_KEY
            }
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