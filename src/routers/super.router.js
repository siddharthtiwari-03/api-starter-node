import { Router } from 'express'

import { superLogin } from '../handlers/super-admin/super.login.post.js'
import { userRouter } from './user.router.js'

const privateRoutes = Router({ mergeParams: true })

/**
 * @swagger
 * /super/login:
 *   post:
 *     tags:
 *       - Super Login
 *     summary: Super Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SuperLogin'
 *     responses:
 *       200:
 *         description: super admin Login Successful
 *       400:
 *         description: Bad Request on super admin login
 *       401:
 *         description: Invalid LoginID for super admin
 *       403:
 *         description: Invalid Password for super admin
 */
privateRoutes.post('/login', superLogin)


privateRoutes.use('/users', userRouter.reservedRoutes, userRouter.protectedRoutes, userRouter.sharedRoutes)

export const superRouter = { privateRoutes }