// External dependencies start here

const router = require('express').Router({ mergeParams: true })
const bcrypt = require('bcrypt')

// External dependencies end here

// Internal dependencies start here

const { User } = require('../../models/user.class')

// Internal dependencies end here


// ### Routes start here

// Login method starts here
router.post('/login', async (req, res) => {

    // get login ID and password from body
    const { loginID, password } = req.body
    console.log('user login invoked', loginID, password)

    // limit query data
    const select = ['userID', 'fname', 'lname', 'userPass', 'userStatus']

    // create conditions to search DB
    const where = [['userEmail', '=', `'${loginID}'`]]
    // const where = { userEmail: '#' + loginID }


    // execute query
    const found = await User.find({ select, where }).catch(e => e)

    console.log('user found', found)

    switch (true) {
        // catch generic errors or client induced errors
        case !found.success: {
            console.error('error while finding user', found)
            return res.status(400).json(found)
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

    const { userPass, ...user } = found.result[0]

    // Check if entered password matches
    const match = await bcrypt.compare(password, userPass)

    // handle if password is invalid
    if (!match) {
        console.error('Invalid password!')
        return res.status(403).json({ success: false, error: 'Invalid Password!' })
    }

    // generate access token using any method
    const access_token = ''
    const refresh_token = ''

    // send response with token and limited user data
    res.status(200).json({ success: true, access_token, account: user })
})
// Login method ends here

// ### Routes end here

module.exports = router