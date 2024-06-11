// External dependencies start here

const router = require('express').Router({ mergeParams: true })

// External dependencies end here

// Internal dependencies start here

const Hotel = require('../../models/hotel.class')

// Internal dependencies end here

// ### Routes start here

// hotel login start here
router.post('/login', async (req, res) => {
    console.log('hotel login invoked')

    const { loginID, password } = req.body

    const where = [['email', '=', `'${loginID}'`]]

    const found = await Hotel.find({ where }).catch(e => e)

    if (!found.success) {
        console.log('error while finding hotel', found.error.sqlMessage || found.error.message || found.error)
        return res.status(400).json(found)
    }

    // check login ID is valid
    if (found.result.length == 0) {
        console.log('Invalid loginID')
        return res.status(400).json({ success: false, error: 'Invalid login ID!' })
    }

    const { password: pass, hotelID, ...hotel } = found.result[0]

    // Check if entered password matches
    const match = await bcrypt.compare(password, pass)

    // handle if password is invalid
    if (!match) {
        console.log('Invalid password!')
        return res.json({ success: false, error: 'Invalid Password!' })
    }

    // generate access token using any method
    const token = ''

    // send response with token and limited hotel data
    res.status(200).json({ success: true, token, hotel })
})
// hotel login ends here


// Get hotel info start here
router.get('/:hotelID', async (req, res) => {
    console.log('get hotel info invoked')

    const { hotelID } = req.params

    const where = [['hotelID', '=', hotelID]]

    const found = await Hotel.find({ where }).catch(e => e)

    if (!found.success) {
        console.log('error while fetching hotels', found.error.sqlMessage || found.error.message || found.error)
        return res.status(400).json(found)
    }

    if (found.result.length == 0) {
        console.log('hotel not found')
        return res.status(400).json({ success: false, error: 'Invalid request! No such hotel found' })
    }

    return res.status(200).json({ success: true, result: found.result[0] })
})
// Get hotel info end here


// ### Routes end here

module.exports = router