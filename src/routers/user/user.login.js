// External dependencies start here
const bcrypt = require('bcrypt')
// External dependencies end here

// Internal dependencies start here
const { User } = require('../../models/user.class')
const { prettifyError } = require('../../services/helper.service')
// Internal dependencies end here


const userLogin = async (req, res) => {

    // get login ID and password from body
    const { loginID, password } = req.body
    console.log('user login invoked', loginID, password)

    // limit query data
    const select = ['userID', 'firstName', 'lastName', 'userPassword', 'userStatus']

    // create conditions to search DB
    const where = { userEmail: `#${loginID}` }
    // const where = { userEmail: '#' + loginID }


    // execute query
    const found = await User.find({ select, where })

    console.log('user found', found)

    switch (true) {
        // catch generic errors or client induced errors
        case !found.success: {
            console.error('error while finding user', found)
            return res.status(400).json(prettifyError(found))
        }

        // check login ID is valid
        case found.result.length == 0: {
            console.error('Invalid loginID')
            return res.status(401).json({ success: false, error: 'Invalid login ID!' })
        }

        // check if user is inactive
        case found.result[0].userStatus == 0: {
            console.error('In-active user account')
            return res.status(403).json({ success: false, error: 'Action Denied! Your account is disabled' })
        }
    }

    const { userPassword, ...user } = found.result[0]

    // Check if entered password matches
    const match = await bcrypt.compare(password, userPassword)

    // handle if password is invalid
    if (!match) {
        console.error('Invalid password!')
        return res.status(403).json({ success: false, error: 'Invalid Password!' })
    }

    // generate access token using any method
    const access_token = ''
    const refresh_token = ''

    res.appendHeader('x-refresh-token', refresh_token)

    // send response with token and limited user data
    res.status(200).json({ success: true, access_token, account: user })
}

module.exports = { userLogin }