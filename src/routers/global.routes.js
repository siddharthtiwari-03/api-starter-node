const router = require('express').Router({ mergeParams: true })
const bcrypt = require('bcrypt')
const { envs } = require('../services/environment.service')

router.get('/', (req, res) => res.status(200).send('API working perfectly!'))

router.get('/hash/:data', async (req, res) => {
    console.info('hashing raw input data')
    const { data } = req.params

    try {
        const hashed = await bcrypt.hash(data, envs.salt_rounds)
        console.info('raw data hashed successfully!')
        return res.status(200).json({ success: true, hashed })
    } catch (error) {
        console.error('error while hashing raw data', error)
        return res.status(400).json({ success: false, error: error?.message || error })
    }

})

router.get('/secret', async (req, res) => {
    console.info('generating secret invoked')

    const secret = require('crypto').randomBytes(64).toString('hex')
    console.log('secret', secret)
    return res.status(200).json({ success: true, secret })

})

router.all('*', (req, res, next) => res.status(404).json({ success: false, error: 'End-point not found! Looks like you entered incorrect URL' }))

module.exports = router