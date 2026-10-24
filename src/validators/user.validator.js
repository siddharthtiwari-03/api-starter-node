// const { get_user_from_cache, save_user_to_cache } = require("../caches/user.cache")
const { User2 } = require("../models/user2.class")
const { envs } = require("../services/environments.service")
const { prettifyError } = require('../services/helper.service')

/**
 * Inline middleware validates the corporate group
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns
 * @author Siddharth Tiwari
 */
const validateUserInline = async (req, res, next) => {
    console.info('in-line user validator invoked')

    const { userID, user_id } = req.params

    const { accessor } = res.locals || {}

    if ((userID && (Array.isArray(userID) || !userID)) || (user_id && typeof user_id != 'string')) {
        console.error('user Id is required and should be a string or number')
        return res.status(400).json({ success: false, error: 'user Id should be a string or number' })
    }

    const isInt = !isNaN(parseInt(userID))
    const isValidUUID = /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i.test(user_id)

    console.log('isInt', isInt, 'isValidUUID', isValidUUID)

    if (!isInt && !isValidUUID) return next('route')

    const response = await validateUser({ userID, user_id, accessRole: accessor.accessRole })

    if (!response.success) {
        res.status(400).json(response)
        return
    }

    if (!('target' in res.locals)) res.locals.target = {}

    res.locals.target.user = response.account

    return next()
}

/**
 * Validates the corporate group against cache and database.
 * @param {Object} params 
 * @param {string|number} [params.userID]
 * @param {string} [params.user_id]
 * @param {string} [params.accessRole]
 * @returns {Promise<{success: boolean, error?: *, account?: *}>}
 */
const validateUser = async ({ userID, user_id, accessRole }) => {
    console.info('user validator invoked', userID, user_id, accessRole)

    try {

        // const cached = await get_user_from_cache(userID)

        // if (cached != null) {
        //     console.log('cached user found inside user validator', cached)
        //     return { success: true, account: cached }
        // }

        const alias = 'u'

        const select = [`${alias}.*`, 'h.brandID', 'h.brand_id', 'h.corpID', 'h.corp_id', 'c.corpName', 'b.brandName', 'h.hotelName', 'o.outletName']

        const join = [
            { type: 'left', table: envs.tables.outlets.account, alias: 'o', using: { outletID: 'outletID' } },
            { type: 'left', table: envs.tables.hotels.account, alias: 'h', using: { hotelID: 'hotelID' } },
            { type: 'left', table: envs.tables.corporates.account, alias: 'c', using: { 'h.corpID': 'corpID' } },
            { type: 'left', table: envs.tables.brands.account, alias: 'b', using: { 'h.brandID': 'brandID' } },
        ]

        const where = user_id ? { user_id: `#${user_id}` } : { userID }

        const found = await User2.find({
            alias,
            select,
            join,
            where,
            // debug: 'query'
        })

        if (!found.success) {
            console.error('error while validating user', found)
            return prettifyError(found)
        }

        if (!found.result.length) {
            console.error('invalid user Id')
            return { success: false, error: `Invalid user Id` }
        }

        if (accessRole && accessRole?.includes('user') && found.result[0].userStatus == 0) {
            console.error('User account suspended')
            return { success: false, error: "Request Denied! Your account is suspended" }
        }
        const { userPassword, ...account } = found.result[0]

        // await save_user_to_cache(userID, account)

        console.info('user valid!')
        return { success: true, account }

    } catch (error) {
        console.error('exception while validating user', error)
        return { success: false, error }
    }
}

module.exports = { validateUserInline, validateUser }