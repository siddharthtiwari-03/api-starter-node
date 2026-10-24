
const bcrypt = require('bcrypt')
const { envs } = require('../../services/environment.service')

const getHash = async (req, res) => {
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

}

module.exports = { getHash }