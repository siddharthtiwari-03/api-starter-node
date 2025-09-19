const router = require('express').Router({ mergeParams: true })

// Internal dependencies start here
const { User } = require('../../models/user.class')
const { prettifyError } = require('../../services/helper.service')
// Internal dependencies end here

const patchUser = async (req, res) => {
    const userID = req.params.userID
    const data = req.body
    console.log('update user invoked!', userID, data)

    // Update user data
    const patched = await User.save({ data, where: { userID } })
    console.log('patched', patched)

    if (!patched.success) {
        console.error('Error updating user:', patched)
        return res.status(400).json(prettifyError(patched))
    }

    res.json(patched) // Return the patched user data
}

module.exports = { patchUser }