// Internal dependencies start here
const { User } = require('../../models/user.class')
const { prettifyError } = require('../../services/helper.service')
// Internal dependencies end here

const getUserInfo = async (req, res) => {
    const { user_id } = req.params
    console.info('get user info invoked!', user_id)

    // Get user info by user_id
    const found = await User.find({ where: { user_id: `#${user_id}` } })

    if (!found.success) {
        console.error('Error updating user:', found)
        return res.status(400).json(prettifyError(found))
    }

    if (found.result.length === 0) {
        return res.status(400).json({ success: false, error: 'Invalid User Id! User not found' })
    }

    const { user_password, ...user } = found.result[0]

    return res.status(200).json({ success: true, result: user }) // Return the updated user data
}

module.exports = { getUserInfo }