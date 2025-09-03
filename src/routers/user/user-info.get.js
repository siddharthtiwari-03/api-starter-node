const router = require('express').Router({ mergeParams: true })

// Internal dependencies start here
const { User } = require('../../models/user.class')
const { prettifyError } = require('../../services/helper.service')
// Internal dependencies end here

const getUserInfo = async (req, res) => {
    const { userID } = req.params

    // Get user info by userID
    const found = await User.find({ where: { userID } })

    if (!found.success) {
        console.error('Error updating user:', found)
        return res.status(400).json(prettifyError(found))
    }

    if (found.result.length === 0) {
        return res.status(400).json({ success: false, error: 'Invalid User Id! User not found' })
    }

    return res.success(200).json({ success: true, result: found.result[0] }) // Return the updated user data
}

module.exports = { getUserInfo }