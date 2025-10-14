const router = require('express').Router({ mergeParams: true })

// Internal dependencies start here

const { userRouter } = require('./routers/user/user.router')
const { superRouter } = require('./routers/super-admin/super.router')
const globalRoutes = require('./routers/global.routes')
const { addPresignedURL } = require('./services/helper.service')
const { generate_put_url } = require('./services/aws-s3.service')

// Internal dependencies end here

// routes mapping start here

router.use('/super', superRouter.privateRoutes)

router.use('/users', userRouter.privateRoutes, userRouter.sharedRoutes)

router.use(globalRoutes)

// routes mapping end here

module.exports = router