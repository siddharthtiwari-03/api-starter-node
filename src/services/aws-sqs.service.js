const { SendMessageCommand } = require("@aws-sdk/client-sqs")
const { sqsClient } = require("./aws.service")

/**
 * sends message over SQS
 * @function pushSQS
 * @description This function will push payLoad message to SQS on specified Queue URL
 * 
 * @param {*} payLoad message (object) that will be pushed to the specified Queue URL
 * 
 * @param {*} QueueUrl SQS Queue URL on which the payLoad will be pushed
 * 
 * @returns {*} response received from the SQS send message function
 * 
 * @author Siddharth Tiwari
 */
const pushSQS = async (payLoad, QueueUrl) => {
    const command = new SendMessageCommand({
        QueueUrl, MessageBody: JSON.stringify(payLoad)
    })

    const sqsRes = await sqsClient.send(command)

    return sqsRes
}

module.exports = { pushSQS }