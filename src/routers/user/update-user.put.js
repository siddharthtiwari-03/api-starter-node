// Internal dependencies start here
const { User } = require('../../models/user.class')
const { prettifyError } = require('../../services/helper.service')
// Internal dependencies end here

const updateUser = async (req, res) => {
    const { userID } = req.params
    const data = req.body
    console.log('update user invoked!', userID, data)

    // Update user data
    const updated = await User.save({ data, where: { userID } })
    console.log('updated', updated)

    if (!updated.success) {
        console.error('Error updating user:', updated)
        return res.status(400).json(prettifyError(updated))
    }

    if (updated.result.length === 0) {
        return res.status(404).json({ success: false, error: 'User not found' })
    }

    res.json(updated) // Return the updated user data
}

module.exports = { updateUser }