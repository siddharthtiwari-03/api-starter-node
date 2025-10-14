const { SuperAdmin } = require("../models/super-admin.class")
const { User } = require("../models/user.class")
const { prettifyError } = require("./helper.service")

/**
 * @function validateSuper
 * @description Validates super admin account
 * @param {*} obj 
 * @returns {*}
 * @author Siddharth Tiwari
 */
const validateSuper = async ({ superID }) => {
    console.info('validate super admin invoked!')

    const found = await SuperAdmin.find({ where: { superID } })

    if (!found.success) {
        console.error('error while finding super admin', found)
        return prettifyError(found)
    }

    if (found.result.length == 0) {
        console.error('Invalid superID')
        return { success: false, error: 'Invalid super admin account!' }
    }

    return { success: true, account: found.result[0] }
}

/**
 * @function validateUser
 * @description Validates user account
 * @param {*} obj 
 * @returns {*}
 * @author Siddharth Tiwari
 */
const validateUser = async ({ userID }) => {
    console.info('validate user invoked!')

    const found = await User.find({ where: { userID } })

    if (!found.success) {
        console.error('error while finding user', found)
        return prettifyError(found)
    }

    if (found.result.length == 0) {
        console.error('Invalid userID')
        return { success: false, error: 'Invalid user account!' }
    }

    return { success: true, account: found.result[0] }
}

/**
 * @type {Object}
 * @property {function} super - Function to validate super admin account
 * @property {function} user - Function to validate user account
 * @description Object containing validation functions for different user roles
 * @author Siddharth Tiwari
 */
const validationHandler = {
    super: async obj => await validateSuper(obj),
    user: async obj => await validateUser(obj)
}

module.exports = { validateSuper, validateUser, validationHandler }