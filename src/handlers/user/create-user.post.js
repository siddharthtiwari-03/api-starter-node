import { User } from '../../models/user.class.js'
import { prettifyError } from '../../services/helper.service.js'

export const createUser = async (req, res) => {
    const data = req.body
    console.info('create user invoked!', data)
    const saved = await User.save({ data })
    
    if (!saved) {
        console.error('Error saving user:', saved)
        return res.status(400).json(prettifyError(saved))
    }

    console.info('User created successfully!')
    return res.status(201).json(saved)
}