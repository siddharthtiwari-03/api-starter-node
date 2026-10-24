const getSecret = async (req, res) => {
    console.info('generating secret invoked')

    const secret = require('crypto').randomBytes(64).toString('hex')
    console.log('secret', secret)
    return res.status(200).json({ success: true, secret })

}

module.exports = { getSecret }