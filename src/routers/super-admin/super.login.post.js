// External dependencies start here
const bcrypt = require('bcrypt')
// External dependencies end here

// Internal dependencies start here
const { prettifyError } = require('../../services/helper.service')
const { SuperAdmin } = require('../../models/super-admin.class')
// Internal dependencies end here


const superLogin = async (req, res) => {

    // get login ID and password from body
    const { loginID, password } = req.body
    console.log('super admin login invoked', loginID, password)

    // limit query data
    const select = ['superId', 'firstName', 'lastName', 'superEmail', 'superPassword']

    // create conditions to search DB
    const where = { superEmail: `#${loginID}` }

    // execute query
    const found = await SuperAdmin.find({ select, where })

    console.log('super admin found', found)

    switch (true) {
        // catch generic errors or client induced errors
        case !found.success: {
            console.error('error while finding super admin', found)
            return res.status(400).json(prettifyError(found))
        }

        // check login ID is valid
        case found.result.length == 0: {
            console.error('Invalid loginID')
            return res.status(401).json({ success: false, error: 'Invalid login ID!' })
        }
    }

    const { superPassword, ...superAdmin } = found.result[0]

    // Check if entered password matches
    const match = await bcrypt.compare(password, superPassword)

    // handle if password is invalid
    if (!match) {
        console.error('Invalid password!')
        return res.status(403).json({ success: false, error: 'Invalid Password!' })
    }

    // generate access token using any method
    const access_token = ''
    const refresh_token = ''

    res.appendHeader('x-refresh-token', refresh_token)

    // send response with token and limited superAdmin data
    res.status(200).json({ success: true, access_token, account: superAdmin })
}

module.exports = { superLogin }