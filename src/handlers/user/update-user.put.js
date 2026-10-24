// Internal dependencies start here
const { User } = require('../../models/user.class')
const { prettifyError } = require('../../services/helper.service')
// Internal dependencies end here

const updateUser = async (req, res) => {
    const { user_id } = req.params
    const data = req.body
    console.log('update user invoked!', user_id, data)

    // Update user data
    const updated = await User.save({ data, where: { user_id: `#${user_id}` } })
    console.log('updated', updated)

    if (!updated.success) {
        console.error('Error updating user:', updated)
        return res.status(400).json(prettifyError(updated))
    }

    if (updated.result.affectedRows == 0) {
        console.error('Invalid user reference', updated)
        return res.status(400).json({ success: false, error: `Action Denied! Invalid user reference` })
    }

    res.status(200).json(updated) // Return the updated user data
}

module.exports = { updateUser }