const router = require('express').Router()

router.get('/', (req, res) => res.status(200).send('API working perfectly!'))

module.exports = router