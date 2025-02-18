const router = require('express').Router({ mergeParams: true })

router.get('/', (req, res) => res.status(200).send('API working perfectly!'))

router.all('*', (req, res, next) => res.status(404).json({ success: false, error: 'End-point not found! Looks like you entered incorrect URL' }))

module.exports = router