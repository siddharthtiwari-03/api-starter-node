// External dependencies start here

const router = require('express').Router()
const { log, error } = require('console')

// External dependencies end here

// Internal dependencies start here

const User = require('../../models/user.class')

// Internal dependencies end here


// ### Routes start here

// Login method starts here
router.post('/login', async (req, res) => {

    // get login ID and password from body
    const { loginID, password } = req.body
    log('user login invoked', loginID, password)

    // limit query data
    const select = 'userID, password'

    // create conditions to search DB
    const where = [['email', '=', loginID]]

    // execute query
    const found = await User.find({ select, where }).catch(e => e)
    log('found', found)

    // catch generic errors or client induced errors
    if (!found.success) return res.json(found)

    // check login ID is valid
    if (found.result.length == 0) return res.json({ success: false, error: 'Invalid login ID!' })

    const { pass, userID, ...usr } = found.result[0]

    // Check if entered password matches
    const match = await bcrypt.compare(password, pass)

    // handle if password is invalid
    if (!match) return res.json({ success: false, error: 'Invalid Password!' })

    // generate access token using any method
    const token = ''

    // send response with token and limited user data
    res.json({ success: true, token, user: usr })
})
// Login method ends here

// ### Routes end here

module.exports = router