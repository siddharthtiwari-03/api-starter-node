// External dependencies start here

const router = require('express').Router()

// External dependencies end here

// Internal dependencies start here

const User = require('../../models/user.class')

// Internal dependencies end here


// ### Routes start here

// Login method starts here
router.post('/login', async (req, res) => {

    // get login ID and password from body
    const { loginID, password } = req.body
    console.log('user login invoked', loginID, password)

    // limit query data
    const select = 'userID, password'

    // create conditions to search DB
    const where = [['email', '=', loginID]]

    // execute query
    const found = await User.find({ select, where }).catch(e => e)

    // catch generic errors or client induced errors
    if (!found.success) {
        console.log('error while finding user', found.error.sqlMessage || found.error.message || found.error)
        return res.status(400).json(found)
    }

    // check login ID is valid
    if (found.result.length == 0) {
        console.log('Invalid loginID')
        return res.status(400).json({ success: false, error: 'Invalid login ID!' })
    }

    const { password: pass, userID, ...user } = found.result[0]

    // Check if entered password matches
    const match = await bcrypt.compare(password, pass)

    // handle if password is invalid
    if (!match) {
        console.log('Invalid password!')
        return res.json({ success: false, error: 'Invalid Password!' })
    }

    // generate access token using any method
    const token = ''

    // send response with token and limited user data
    res.status(200).json({ success: true, token, user })
})
// Login method ends here

// ### Routes end here

module.exports = router