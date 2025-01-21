// External dependencies start here

const router = require('express').Router()

// External dependencies end here

// Internal dependencies start here

const { User } = require('../../models/user.class')

// Internal dependencies end here


// ### Routes start here

// Create user starts here
router.post('/', async (req, res) => {
    const data = req.body
    console.log('create user invoked!', data)
    const saved = await User.save({ data }).catch(e => e)
    console.log('saved', saved)
    res.json(saved)
})
// Create user end here


// ### Routes end here

module.exports = router