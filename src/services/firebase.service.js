const { initializeApp } = require("firebase-admin/app")
const { credential } = require("firebase-admin")
const { getMessaging } = require("firebase-admin/messaging")

// this file is Important!
const firebaseCreds = require('../utils/nitecapp-application-firebase-adminsdk-r9qo5-25da5bf1d4.json')

const fcmApp = initializeApp({ credential: credential.cert(firebaseCreds) })

/**
 * Sends push notifications to user devices using 
 * @function pushFCM
 * @description This function will send push notifications to both Android and iOs apps using Google's Firebase Cloud Messaging (FCM)
 * 
 * @param {*} payLoad push notification to be sent to the user device
 * 
 * @returns {{success:boolean, result?:*, error?:* }}
 */
const pushFCM = async (payLoad) => {
    
    try {

        if ('token' in payLoad) {
            const published = await getMessaging().send(payLoad)
            return { success: true, result: published }
        } else if ('tokens' in payLoad) {
            const published = await getMessaging().sendEachForMulticast(payLoad)
            return { success: true, result: published }
        }
    } catch (error) {
        console.error('error while pushing message to fcm', error)
        return { success: false, error }
    }

}

module.exports = { pushFCM }