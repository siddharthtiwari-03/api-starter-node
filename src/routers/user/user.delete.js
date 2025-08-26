const { User } = require("../../models/user.class")
const { prettifyError } = require("../../services/helper.service")

const deleteUser = async (req, res) => {
    const { userID } = req.params
    console.info('delete user invoked!', userID)

    // Delete user data
    const deleted = await User.delete({ where: { userID } })

    if (!deleted.success) {
        console.error('Error deleting user:', deleted)
        return res.status(400).json(prettifyError(deleted))
    }

    console.info('User deleted successfully!')
    return res.status(200).json({ success: true, message: 'User deleted successfully' }) // Return success message
}

module.exports = { deleteUser }