// External dependencies start here

const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3")
const { s3Client } = require("./aws.service")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { envs } = require("./environment.service")

// External dependencies end here

// Internal dependencies start here

const Bucket = envs.aws.s3.bucket_name

// Internal dependencies end here

/**
 * Generates URL to PUT Media in S3 bucket
 * @function generateURL_PUT
 * @description This function is used to generate dynamic pre-signed URL to 'PUT' any object (with pre-defined 'ContentType') inside AWS S3 bucket using 'Key'
 * 
 * @param {object} putParam
 * 
 * @param {string} putParam.ContentType defines the mime type of the file that needs to be uploaded
 * 
 * @param {string} putParam.Key is an important unique identifier used by AWS S3 bucket to define the path where the file will be stored and accessed
 * 
 * @returns {string} dynamically generated pre-signed URL
 * 
 * @author Siddharth Tiwari
 */
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

/**
 * Generates URL to 'GET' Media in S3 bucket
 * @function generateURL_GET
 * @description This function is used to generate dynamic pre-signed URL to 'GET' any object stored inside AWS S3 bucket using 'Key'
 * 
 * @param {object} getParam
 * 
 * @param {string} getParam.Key unique identifier used by AWS S3 bucket to locate the file
 * 
 * @returns {string} dynamically generated pre-signed URL
 * 
 * @author Siddharth Tiwari
 */
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