const { S3Client } = require("@aws-sdk/client-s3")
const { SQSClient } = require('@aws-sdk/client-sqs')
const { SNSClient } = require('@aws-sdk/client-sns')
const { envs } = require("./environment.service")

// // generates AWS client for S3
// const s3Client = new S3Client({
//     region: envs.aws.s3.region,
//     credentials: {
//         accessKeyId: envs.aws.s3.user.access_key_id,
//         secretAccessKey: envs.aws.s3.user.secret_access_key
//     }
// })

// // generates AWS client for SQS
// const sqsClient = new SQSClient({
//     region: envs.aws_sqs_region,
//     credentials: {
//         accessKeyId: envs.aws.sqs.user.access_key_id,
//         secretAccessKey: envs.aws.sqs.user.secret_access_key
//     }
// })

// // generates AWS client for SNS
// const snsClient = new SNSClient({
//     region: AWS_SNS_REGION,
//     credentials: {
//         accessKeyId: envs.aws.sns.user.access_key_id,
//         secretAccessKey: envs.aws.sns.user.secret_access_key
//     }
// })

// module.exports = { s3Client, sqsClient, snsClient }