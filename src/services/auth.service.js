const jwt = require('jsonwebtoken')

const { debugRequest } = require("./helper.service")
const { envs } = require('./environment.service')
const { validationHandler } = require('./validator.service')

const validRoles = { super: true, user: true }

const skipUrls = [/\/login|\/login2|\/signup/, /\/hash|\/secret/, /\/test/, /\/forgot-password/, /\/export/]

/**
 * @function auth
 * @description Middleware to authenticate and authorize requests using JWT tokens.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {*} Proceeds to the next middleware if authentication is successful, otherwise sends an error response.
 * @author Siddharth Tiwari
 */
const auth = async (req, res, next) => {
    console.info('auth invoked!')

    // Bypass auth for specific urls
    // if (skipUrls.some(url => req.originalUrl.includes(`${url}/`) || req.originalUrl.endsWith(url))) {
    if (skipUrls.some(url => url.test(req.path))) {
        console.info(`authentication skipped for url: ${req.originalUrl}`)
        return next()
    }

    // 1. extract refresher token
    const refreshToken = req.headers['x-custom-refresher']

    // 2. handle missing refresher token
    if (!refreshToken) {
        console.error('authenticate failed! Missing x-custom-refresher header')
        debugRequest(req)
        return res.status(401).json({ success: false, error: 'Authentication failed! Login to continue' })
    }

    // 3. validate refresher token
    try {
        const { iat, exp, ...refresher } = jwt.verify(refreshToken, envs.jwt.refresh_secret)
        console.log('refresher decoded', refresher)
        res.locals.refresher = refresher
        next()
    } catch (error) {
        console.error('error while decoding refresher', error)
        debugRequest(req)

        const errorTypes = {
            'jwt expired': 'Login expired! Please login to continue',
            'jwt must be provided': 'Un-authorized access attempt!',
            'jwt malformed': "Access Denied! Malicious token detected",
        }
        return res.status(401).json({ success: false, error: errorTypes[error.message] || error?.message || error })
    }

    // 4. extract authorization header
    const authorization = req.headers['authorization']

    // 5. handle missing authorization token
    if (!authorization) {
        console.error('Authorization failed! Missing authorization header')
        debugRequest(req)
        return res.status(403).json({ success: false, error: 'Authorization failed! Access token missing' })
    }

    // 6. validate authorization token
    const token = authorization.split(' ')[1]

    try {
        const { iat, exp, ...accessor } = jwt.verify(token, envs.jwt.refresh_secret)

        const signaturesCheck = {
            super: res.locals.refresher?.superID === accessor?.superID,
            user: res.locals.refresher?.userID === accessor?.userID
        }

        // 7. handle mismatched signatures
        if (!signaturesCheck?.[accessor?.accessRole]) {
            console.error('authenticate failed! Token signature mismatch')
            return res.status(403).json({ success: false, error: 'Authentication failed! Token signature mismatch' })
        }

    } catch (error) {
        console.error('error while decoding access token', error)
        debugRequest(req)

        const errorTypes = {
            'jwt expired': 'Access token expired! Please refresh your access token',
            'jwt must be provided': 'Un-authorized access attempt!',
            'jwt malformed': "Access Denied! Malicious token detected",
        }
        return res.status(401).json({ success: false, error: errorTypes[error.message] || error?.message || error })
    }

    const validation = await validationHandler?.[res.locals.accessor.accessRole]?.(res.locals.accessor)

    if (!validation?.success) {
        console.error('authenticate failed! Token validation failed')
        return res.status(403).json(validation)
    }

    next()
}


module.exports = { auth }