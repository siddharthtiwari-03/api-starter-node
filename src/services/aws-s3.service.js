// External dependencies start here

const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3")
const { s3Client } = require("./aws.service")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { envs } = require("./environment.helper")

// External dependencies end here

// Internal dependencies start here

const Bucket = envs.aws.s3.bucket_name

// Internal dependencies end here

// Generate URL to PUT Media in S3 bucket
const generateURL_PUT = async ({ ContentType, Key }) => {
    const putCommand = new PutObjectCommand({
        Bucket,
        ContentType,
        Key,
    })

    try {
        const signedURL = await getSignedUrl(s3Client, putCommand)
        return { success: true, signedURL }
    } catch (error) {
        return { success: false, error: error.message || error }
    }
}

// Generate URL to GET Media from S3 bucket
const generateURL_GET = async ({ Key }) => {
    const getCommand = new GetObjectCommand({
        Bucket,
        Key
    })
    try {
        const signedURL = await getSignedUrl(s3Client, getCommand)
        return { success: true, signedURL }
    } catch (error) {
        return { success: false, error: error.message || error }
    }
}

module.exports = { generateURL_PUT, generateURL_GET }