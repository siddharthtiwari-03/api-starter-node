const jwt = require('jsonwebtoken')

const { debugRequest } = require("./helper.service")
const { envs } = require('./environment.service')
const { validateSuperAdmin } = require('../validators/super-admin.validator')

const skipUrls = [/\/login|\/login2|\/signup/, /\/hash|\/secret/, /\/test/, /\/forgot-password/, /\/export/, /\/health/, /\/health-check/]

/**
 * @function auth
 * @description Middleware to authenticate and authorize requests using JWT tokens.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns
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

        const refresher_verified = jwt.verify(refreshToken, envs.jwt.refresher_secret)

        if (typeof refresher_verified == 'string') {
            console.error('invalid refresher')
            return
        }

        const { iat, exp, ...refresher } = refresher_verified
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

        const accessor_verified = jwt.verify(token, envs.jwt.refresher_secret)

        if (typeof accessor_verified == 'string') {
            console.error('invalid refresher')
            return
        }

        const { iat, exp, ...accessor } = accessor_verified

        const signaturesCheck = {
            super: res.locals.refresher?.super_id === accessor?.super_id,
            user: res.locals.refresher?.user_id === accessor?.user_id
        }

        // 7. handle mismatched signatures
        if (!(accessor?.accessRole in signaturesCheck)) {
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

    const validationHandler = {
        super: async () => validateSuperAdmin(res.locals.accessor),
        user: async () => validateSuperAdmin(res.locals.accessor),
    }

    const validation = await validationHandler[res.locals.accessor.accessRole]()

    if (!validation?.success) {
        console.error('authenticate failed! Token validation failed')
        return res.status(403).json(validation)
    }

    next()
}


module.exports = { auth }