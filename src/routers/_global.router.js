import { Router } from 'express'

import { getHash } from '../handlers/_global/hash.get.js'
import { getSecret } from '../handlers/_global/secret.get.js'

export const globalRouter = Router({ mergeParams: true })

globalRouter.get('/', (req, res) => res.status(200).send('API working perfectly!'))

globalRouter.get('/hash/:data', getHash)

globalRouter.get('/secret', getSecret)

globalRouter.all('/*splat', (req, res, _next) => res.status(404).json({ success: false, error: 'End-point not found! Looks like you entered incorrect URL' }))