const { SendMessageCommand } = require("@aws-sdk/client-sqs")
const { sqsClient } = require("./aws.service")

const sendEmail = async (payLoad, QueueUrl) => {
    const command = new SendMessageCommand({
        QueueUrl, MessageBody: JSON.stringify(payLoad)
    })

    const sqsRes = await sqsClient.send(command)

    return sqsRes
}

module.exports = { sendEmail }