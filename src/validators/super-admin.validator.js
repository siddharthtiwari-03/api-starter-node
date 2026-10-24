const { SuperAdmin } = require("../models/super-admin.class")
const { prettifyError } = require('../services/helper.service')

/**
 * Inline middleware validates the corporate group
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns
 * @author Siddharth Tiwari
 */
const validateSuperAdminInline = async (req, res, next) => {
    console.info('in-line super admin validator invoked')

    const { super_id } = req.params

    const { accessor } = res.locals || {}

    if (!super_id || typeof super_id != 'string') {
        console.error('super Id is required and should be a string')
        res.status(400).json({ success: false, error: 'super Id is required and should be a string' })
        return
    }

    const isValidUUID = /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i.test(super_id)

    if (!isValidUUID) return next('route')

    const response = await validateSuperAdmin({ super_id, accessor })

    if (!response.success) {
        res.status(400).json(response)
        return
    }

    if (!('target' in res.locals)) res.locals.target = {}

    res.locals.target.superAdmin = response.account

    return next()
}

/**
 * Validates the corporate group against cache and database.
 * @param {Object} params 
 * @param {number|string} params.super_id 
 * @param {string} [params.accessor] 
 * @returns {Promise<{success: boolean, error?: *, account?: *}>}
 */
const validateSuperAdmin = async ({ super_id, accessor = null }) => {
    console.info('super admin validator invoked', super_id, accessor)

    try {

        const alias = 's'

        const found = await SuperAdmin.find({
            alias,
            select: ['*'],
            where: { super_id: `${super_id}` },
            // debug: 'query'
        })

        if (!found.success) {
            console.error('error while validating super admin', found)
            return prettifyError(found)
        }

        if (!found.result.length) {
            console.error('invalid super admin Id')
            return { success: false, error: `Invalid super admin Id` }
        }

        const { superPassword, ...account } = found.result[0]

        console.info('super admin valid!')
        return { success: true, account }

    } catch (error) {
        console.error('exception while validating super admin', error)
        return { success: false, error }
    }
}

module.exports = { validateSuperAdminInline, validateSuperAdmin }