import { Router } from 'express'


import { globalRouter } from './routers/_global.router.js'
import { userRouter } from './routers/user.router.js'
import { superRouter } from './routers/super.router.js'



export const appRouter = Router({ mergeParams: true })

appRouter.use('/super', superRouter.privateRoutes)

appRouter.use('/users', userRouter.privateRoutes, userRouter.sharedRoutes)

appRouter.use(globalRouter)