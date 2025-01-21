/**
 * @module appRouter
 */

const router = require('express').Router({ mergeParams: true })

// Internal dependencies start here

const userRoutes = require('./routers/user/user.routes')
const globalRoutes = require('./routers/global.routes')

// Internal dependencies end here

// routes mapping start here

router.use('/users', userRoutes)
router.use(globalRoutes)

// routes mapping end here

module.exports = router