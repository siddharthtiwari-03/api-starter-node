const router = require('express').Router({ mergeParams: true })

// Internal dependencies start here

const { globalRouter } = require('./routers/_global.router')
const { userRouter } = require('./routers/user.router')
const { superRouter } = require('./routers/super.router')

// Internal dependencies end here

// routes mapping start here

router.use('/super', superRouter.privateRoutes)

router.use('/users', userRouter.privateRoutes, userRouter.sharedRoutes)

router.use(globalRouter)

// routes mapping end here

module.exports = router