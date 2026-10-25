import { randomBytes } from 'crypto'

export const getSecret = async (req, res) => {
    console.info('generating secret invoked')

    const secret = randomBytes(64).toString('hex')
    console.log('secret', secret)
    return res.status(200).json({ success: true, secret })
}