import { SendMessageCommand, SendMessageBatchCommand } from "@aws-sdk/client-sqs"
import { getSQSClient } from "./aws.service.js"
import { v4 as uuidv4 } from 'uuid'

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
export const pushToQueue = async (payLoad, QueueUrl) => {
    try {

        const command = new SendMessageCommand({
            QueueUrl, MessageBody: JSON.stringify(payLoad)
        })

        const { success, client, ...error } = getSQSClient()

        if (!success) return { success, error }

        const sqsRes = await client.send(command)

        return { success: true, sqsRes }
    } catch (error) {
        console.error('error while pushing to queue', error)
        return { success: false, error: 'Error while processing your request, please try again later!' }
    }
}


const SQS_BATCH_LIMIT = 10 // hard AWS limit per SendMessageBatchCommand call

const chunk = (arr, size) => {
    const out = []
    for (let i = 0; i < arr.length; i += size) {
        out.push(arr.slice(i, i + size))
    }
    return out
}

export const pushBatchToQueue = async (payloads, QueueUrl) => {
    console.info('pushBatchToQueue invoked', payloads?.length, QueueUrl)

    if (!Array.isArray(payloads) || payloads.length === 0) {
        return { success: false, error: 'No payloads provided' }
    }

    const entries = payloads.map((payLoad) => ({ Id: uuidv4(), MessageBody: JSON.stringify(payLoad) }))

    const chunks = chunk(entries, SQS_BATCH_LIMIT)

    const allSuccessful = []
    const allFailed = []

    try {
        const { success, client: sqsClient, ...error } = getSQSClient()

        if (!success) return { success, error }

        for (const batchChunk of chunks) {
            const command = new SendMessageBatchCommand({
                QueueUrl,
                Entries: batchChunk
            })

            const sqsRes = await sqsClient.send(command)

            if (sqsRes.Successful?.length) allSuccessful.push(...sqsRes.Successful)
            if (sqsRes.Failed?.length) {
                console.error('partial batch failure', sqsRes.Failed)
                allFailed.push(...sqsRes.Failed)
            }
        }

        return {
            success: allFailed.length === 0,
            successful: allSuccessful,
            failed: allFailed
        }

    } catch (error) {
        console.error('error while pushing batch to queue', error)
        return { success: false, error: 'Error while processing your request, please try again later!' }
    }
}