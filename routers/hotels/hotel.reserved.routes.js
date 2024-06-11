// External dependencies start here

const router = require('express').Router({ mergeParams: true })

// External dependencies end here

// Internal dependencies start here

const Hotel = require('../../models/hotel.class')

// Internal dependencies end here


// ### Routes start here


// Get all hotels start here
router.get('/', async (req, res) => {
    console.log('get all hotels invoked')

    const found = await Hotel.find({}).catch(e => e)

    if (!found.success) {
        console.log('error while fetching hotels', found.error.sqlMessage || found.error.message || found.error)
        return res.status(400).json(found)
    }

    return res.status(200).json({ success: true, result: found.result })
})
// Get all hotels end here


// Create new hotel start here
router.post('/', async (req, res) => {
    console.log('Create new hotel invoked')

    const data = req.body

    const saved = await Hotel.save({ data }).catch(e => e)

    if (!saved.success) {
        console.log('error while finding hotel', saved.error.sqlMessage || saved.error.message || saved.error)
        return res.status(400).json(saved)
    }

    return res.status(200).json({ ...saved, message: 'Hotel created successfully!' })
})
// Create new hotel end here


// ### Routes end here

module.exports = router