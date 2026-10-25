// @ts-check
import { initializeApp, cert } from "firebase-admin/app"
import { getMessaging } from "firebase-admin/messaging"

import fs from 'node:fs'
import path from 'node:path'

import { envs } from "./environment.service.js"


const INVALID_TOKEN_CODES = new Set([
    'messaging/registration-token-not-registered',
    'messaging/invalid-registration-token',
])

const RETRYABLE_CODES = new Set([
    'messaging/internal-error',
    'messaging/server-unavailable',
    'messaging/quota-exceeded',
])

const MAX_TOKENS_PER_CALL = 500

const MAX_MESSAGES_PER_BATCH = 500

try {

    // this is Important
    const configPath = path.resolve(envs.fcm_credential_json)
    const firebaseJson = JSON.parse(fs.readFileSync(configPath, 'utf8'))

    initializeApp({ credential: cert(firebaseJson) })
    console.info('Firebase Admin SDK initialized successfully!')
} catch (/** @type {any} */ err) {
    console.error('FATAL: failed to initialize Firebase Admin SDK', err.message)
    throw err
}


/**
 * Sends push notifications to user devices using Firebase Cloud Messaging
 * @param {*} payLoad push notification to be sent to the user device
 * @param {number} [retries=1]
 * @returns {Promise<{success:boolean, result?:*, error?:string, code?:string, invalidTokens: string[], failedTokens?: string[] }>}
 */
export const pushFCM = async (payLoad, retries = 1) => {
    /**
     * @type {any[]}
     */
    const invalidTokens = []

    try {
        if ('token' in payLoad || 'topic' in payLoad) {
            const published = await getMessaging().send(payLoad)
            return { success: true, result: published, invalidTokens }

        } else if ('tokens' in payLoad) {

            if (payLoad.tokens.length > MAX_TOKENS_PER_CALL) {
                return {
                    success: false,
                    error: `Cannot send to ${payLoad.tokens.length} tokens in one call; caller must chunk into batches of ${MAX_TOKENS_PER_CALL}`,
                    code: 'internal/tokens-not-chunked',
                    invalidTokens,
                }
            }

            const response = await getMessaging().sendEachForMulticast(payLoad)

            /**
             * @type {any[]}
             */
            const failedTokens = []

            // Loop through responses to find bad tokens
            response.responses.forEach((resp, idx) => {
                if (!resp.success && resp.error) {
                    if (INVALID_TOKEN_CODES.has(resp.error.code)) {
                        invalidTokens.push(payLoad.tokens[idx])
                    } else {
                        failedTokens.push({ token: payLoad.tokens[idx], code: resp.error.code, message: resp.error.message })
                        console.error('fcm delivery failed for token', payLoad.tokens[idx], resp.error.code)
                    }
                }
            })

            return {
                success: true, // Multicast itself succeeded, even if some tokens failed
                result: response,
                invalidTokens,
                failedTokens
            }
        }

        return { success: false, error: 'payload must contain either token or tokens', code: 'internal/invalid-payload', invalidTokens }
    } catch (/** @type {any} */ error) {
        const code = error.errorInfo?.code || error.code

        if (INVALID_TOKEN_CODES.has(code)) {
            if (payLoad.token) invalidTokens.push(payLoad.token)
            return { success: false, error: error.message, code, invalidTokens }
        }

        if (RETRYABLE_CODES.has(code) && retries > 0) {
            console.warn(`transient fcm error (${code}), retrying...`)
            await new Promise(r => setTimeout(r, 500))
            return pushFCM(payLoad, retries - 1)
        }

        console.error('error while pushing message to fcm', error)
        return { success: false, error: error.message, code, invalidTokens }
    }
}

/**
 * Sends up to 500 independent messages (each with its own topic or token) in one call.
 * @param {any[]} messages
 * @returns {Promise<{success:boolean, error?:string, code?:string, results:{topic?:string, success:boolean, error?:{code:string, message:string}}[], successCount?:number, failureCount?:number}>}
 */
export const pushFCMBatch = async (messages) => {
    if (!messages.length) return { success: true, results: [], successCount: 0, failureCount: 0 }

    if (messages.length > MAX_MESSAGES_PER_BATCH) {
        return {
            success: false,
            error: `Cannot send ${messages.length} messages in one call; caller must chunk into batches of ${MAX_MESSAGES_PER_BATCH}`,
            code: 'internal/messages-not-chunked',
            results: [],
        }
    }

    try {
        const response = await getMessaging().sendEach(messages)

        const results = response.responses.map((r, idx) => ({
            topic: messages[idx].topic,
            success: r.success,
            ...(r.error && { error: { code: r.error.code, message: r.error.message } }),
        }))

        return { success: true, results, successCount: response.successCount, failureCount: response.failureCount }
    } catch (/** @type {any} */ error) {
        console.error('error while batch pushing to fcm', error)
        return { success: false, error: error.message, code: error.errorInfo?.code || error.code, results: [] }
    }
}

/**
 * 
 * @param {string} deviceToken 
 * @param {string[]} topics
 * @returns
 */
export const subscribeToTopics = async (deviceToken, topics) => {

    console.info(`subscribing device to topics`, deviceToken, topics)

    /** @type {any} */
    const subscribed = []

    /** @type {any} */
    const failed = []

    const settled = await Promise.allSettled(topics.map(async topic => getMessaging().subscribeToTopic(deviceToken, topic)))

    settled.forEach((res, idx) => {
        const topic = topics[idx]

        if (res.status === 'rejected') {
            console.error(`failed to subscribe device to topic ${topic}`, res.reason)
            failed.push({ topic, error: res.reason })
        } else if (res.value.failureCount > 0) {
            const error = res.value.errors?.[0]?.error
            console.error(`failed to subscribe device to topic ${topic}`, error)
            failed.push({ topic, error })
        } else {
            subscribed.push({ topic, result: res.value })
        }
    })

    return { success: failed.length === 0, subscribed, failed }
}

/**
 * 
 * @param {string} deviceToken 
 * @param {string[]} topics
 * @returns
 */
export const unsubscribeFromTopics = async (deviceToken, topics) => {

    console.info(`unsubscribing device from topics`, deviceToken, topics)

    /** @type {any} */
    const unsubscribed = []

    /** @type {any} */
    const failed = []

    const settled = await Promise.allSettled(
        topics.map(topic => getMessaging().unsubscribeFromTopic(deviceToken, topic))
    )

    settled.forEach((res, idx) => {
        const topic = topics[idx]
        if (res.status === 'rejected') {
            console.error(`failed to unsubscribe device from topic ${topic}`, res.reason)
            failed.push({ topic, error: res.reason })
        } else if (res.value.failureCount > 0) {
            const error = res.value.errors?.[0]?.error
            console.error(`failed to unsubscribe device to topic ${topic}`, error)
            failed.push({ topic, error })
        } else {
            unsubscribed.push({ topic, result: res.value })
        }
    })

    return { success: failed.length === 0, unsubscribed, failed }
}