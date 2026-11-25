import { Router } from 'express'

import { getHash } from '../handlers/_global/hash.get.js'
import { getSecret } from '../handlers/_global/secret.get.js'
import { handle404Error } from '../handlers/_global/error-404.handler.js'
import { getHealthCheck } from '../handlers/_global/health-check.get.js'

export const globalRouter = Router({ mergeParams: true })

globalRouter.get('/', (req, res) => res.status(200).send('API working perfectly!'))

globalRouter.get(['/health', '/health-check'], getHealthCheck)

globalRouter.get('/hash/:data', getHash)

globalRouter.get('/secret', getSecret)

globalRouter.use(handle404Error)