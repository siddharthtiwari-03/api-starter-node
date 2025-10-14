const { S3Client } = require("@aws-sdk/client-s3")
const { SQSClient } = require('@aws-sdk/client-sqs')
const { SNSClient } = require('@aws-sdk/client-sns')
const { BedrockRuntimeClient } = require('@aws-sdk/client-bedrock-runtime')
const { envs } = require("./environment.service")

/**
 * @namespace awsClients
 * @description A frozen object to hold singleton instances of various AWS clients.
 * This prevents the object itself from being modified, ensuring that clients are
 * only initialized once and are always accessed in a controlled manner.
 * @property {import("@aws-sdk/client-s3").S3Client | null} s3Client - The singleton instance of the S3Client.
 * @property {import("@aws-sdk/client-sqs").SQSClient | null} sqsClient - The singleton instance of the SQSClient.
 * @property {import("@aws-sdk/client-sns").SNSClient | null} snsClient - The singleton instance of the SNSClient.
 * @property {import("@aws-sdk/client-bedrock-runtime").BedrockRuntimeClient | null} bedrockEmbeddingsClient - The singleton instance of the BedrockRuntimeClient.
 * @type {Readonly<Object>}
 * @author Siddharth Tiwari
 */
const awsClients = Object.freeze({ s3Client: { get: null, put: null, delete: null, all: null }, s3ClientGet: null, s3ClientPut: null, snsClient: null, sqsClient: null, bedrockClient: { embeddings: null, chat: null } })

const permissions = Object.freeze({ get: true, put: true, delete: true, all: true })

/**
 * @function getS3Client
 * @description Generates a singleton instance of the AWS S3 Client
 * @param {'get'|'put'|'delete'|'all'} [permission='read'] type of client required
 * @author Siddharth Tiwari
 * @returns {import("@aws-sdk/client-s3").S3Client} The singleton instance of the S3 Client
 */
const getS3Client = (permission = 'get') => {

    if (!permissions?.[permission]) throw new Error(`Invalid S3 client permission: ${permission}`)

    if (awsClients.s3Client[permission]) return { success: true, client: awsClients.s3Client[permission] }

    const cred = envs.aws.s3.user[permission]

    if (!cred.access_key_id || !cred.secret_access_key) return { success: false, error: `AWS User Credentials empty for ${permission}!` }

    awsClients.s3Client[permission] = new S3Client({
        region: envs.aws.s3.region,
        credentials: {
            accessKeyId: cred.access_key_id,
            secretAccessKey: cred.secret_access_key
        }
    })
    return { success: true, client: awsClients.s3Client[permission] }
}


/**
 * @function getSQSClient
 * @description Generates a singleton instance of the AWS SQS Client
 * @author Siddharth Tiwari
 * @returns {import("@aws-sdk/client-sqs").SQSClient} The singleton instance of the SQS Client
 */
const getSQSClient = () => {

    if (awsClients.sqsClient) return { success: true, client: awsClients.sqsClient }

    awsClients.sqsClient = new SQSClient({
        region: envs.aws_sqs_region,
        credentials: {
            accessKeyId: envs.aws.sqs.user.access_key_id,
            secretAccessKey: envs.aws.sqs.user.secret_access_key
        }
    })
    return { success: true, client: awsClients.sqsClient }
}


/**
 * @function getSNSClient
 * @description Generates a singleton instance of the AWS SNS Client
 * @author Siddharth Tiwari
 * @returns {import("@aws-sdk/client-sns").SNSClient} The singleton instance of the SNS Client
 */
const getSNSClient = () => {

    if (awsClients.snsClient) return { success: true, client: awsClients.snsClient }

    awsClients.snsClient = new SNSClient({
        region: envs.aws.sns.region,
        credentials: {
            accessKeyId: envs.aws.sns.user.access_key_id,
            secretAccessKey: envs.aws.sns.user.secret_access_key
        }
    })
    return { success: true, client: awsClients.snsClient }
}


/**
 * @function getBedrockClient
 * @description Generates a singleton instance of the AWS Bedrock Runtime Client
 * @param {'embeddings'|'chat'} [type=embeddings] Type of client required
 * @param {string} [awsRegion] Region
 * @author Siddharth Tiwari
 * @returns {import("@aws-sdk/client-bedrock-runtime").BedrockRuntimeClient} The singleton instance of the BedrockRuntimeClient
 */
const getBedrockClient = (type = null, awsRegion = null, totalAttempts = 2) => {

    type = type || 'embeddings'

    if (awsClients.bedrockClient[type]) return { success: true, client: awsClients.bedrockClient[type] }

    awsClients.bedrockClient[type] = new BedrockRuntimeClient({
        region: awsRegion || 'us-west-2', // fallback provided for AWS Bedrock embeddings as embeddings is only provided in 'us-west-2' region
        credentials: {
            accessKeyId: envs.aws.bedrock.access_key_id,
            secretAccessKey: envs.aws.bedrock.secret_access_key
        },
        maxAttempts: totalAttempts || 2 // Set the maximum number of total attempts (initial + 1 retry)
    })
    return { success: true, client: awsClients.bedrockClient[type] }
}

module.exports = { getS3Client, getSQSClient, getSNSClient, getBedrockClient }