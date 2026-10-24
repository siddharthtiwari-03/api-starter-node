const { User } = require("../../models/user.class")
const { prettifyError } = require("../../services/helper.service")

const deleteUser = async (req, res) => {
    const { user_id } = req.params
    console.info('delete user invoked!', user_id)

    // Delete user data
    const deleted = await User.delete({ where: { user_id: `#${user_id}` } })

    if (!deleted.success) {
        console.error('Error deleting user:', deleted)
        return res.status(400).json(prettifyError(deleted))
    }

    if (deleted.result.affectedRows == 0) {
        console.error('Invalid user reference', deleted)
        return res.status(400).json({ success: false, error: `Action Denied! Invalid user reference` })
    }

    console.info('User deleted successfully!')
    return res.status(200).json({ success: true, message: 'User deleted successfully' }) // Return success message
}

module.exports = { deleteUser }