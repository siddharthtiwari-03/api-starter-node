import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { User } from '../../models/user.class.js'
import { prettifyError } from '../../services/helper.service.js'
import { envs } from '../../services/environment.service.js'

export const userLogin = async (req, res) => {

    // get login ID and password from body
    const { loginID, password, keepSigned } = req.body
    console.log('user login invoked', loginID, password)

    // limit query data
    const select = ['user_id', 'first_name', 'last_name', 'user_password', 'user_status']

    // create conditions to search DB
    const where = { user_email: `#${loginID}` }
    // const where = { user_email: '#' + loginID }


    // execute query
    const found = await User.find({ select, where, debug: 'query' })

    // catch generic errors or client induced errors
    if (!found.success) {
        console.error('error while finding user', found)
        return res.status(400).json(prettifyError(found))
    }

    // check login ID is valid
    if (found.result.length == 0) {
        console.error('Invalid loginID')
        return res.status(401).json({ success: false, error: 'Invalid login ID!' })
    }

    // check if user is inactive
    if (found.result[0].user_status == 0) {
        console.error('In-active user account')
        return res.status(403).json({ success: false, error: 'Action Denied! Your account is disabled' })
    }

    const { user_password, ...user } = found.result[0]

    // Check if entered password matches
    const match = await bcrypt.compare(password, user_password)

    // handle if password is invalid
    if (!match) {
        console.error('Invalid password!')
        return res.status(403).json({ success: false, error: 'Invalid Password!' })
    }

    // generate access token using any method
    const refresh_token = jwt.sign({ user_id: user.user_id, accessRole: 'user' }, envs.jwt.refresher_secret, { expiresIn: keepSigned ? '180d' : envs.jwt.refresher_ttl })
    const access_token = jwt.sign({ user_id: user.user_id, accessRole: 'user' }, envs.jwt.accessor_secret, { expiresIn: envs.jwt.accessor_ttl })

    res.appendHeader('x-refresh-token', refresh_token)

    // send response with token and limited user data
    res.status(200).json({ success: true, access_token, account: user })
}