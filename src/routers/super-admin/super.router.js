// self only: login, forgot-password
const privateRoutes = require('express').Router({ mergeParams: true })

const { userRouter } = require('../user/user.router')
const { superLogin } = require('./super.login.post')

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

const superRouter = { privateRoutes }

module.exports = { superRouter }