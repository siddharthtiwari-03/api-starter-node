const privateRoutes = require('express').Router({ mergeParams: true })
const sharedRoutes = require('express').Router({ mergeParams: true })
const protectedRoutes = require('express').Router({ mergeParams: true })
const reservedRoutes = require('express').Router({ mergeParams: true })

const { createUser } = require('./user.create')
const { deleteUser } = require('./user.delete')
const { getUserInfo } = require('./user.get')
const { getAllUsers } = require('./user.get-all')
const { userLogin } = require('./user.login')
const { patchUser } = require('./user.patch')
const { updateUser } = require('./user.update')

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID.
 *         name:
 *           type: string
 *           description: The user's name.
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address.
 *     UserLogin:
 *       type: object
 *       required:
 *         - loginID
 *         - password
 *       properties:
 *         loginID:
 *           type: string
 *         password:
 *           type: string
 *     UserUpdate:
 *       type: object
 *       required:
 *         - userEmail
 *         - firstName
 *       properties:
 *         userEmail:
 *           type: string
 *         firstName:
 *           type: string
 *     UserPatch:
 *       type: object
 *       required:
 *         - userStatus
 *       properties:
 *         userStatus:
 *           type: boolean
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - User List
 *       - Super Admin
 *     summary: Get a list of all users
 *     description: This endpoint retrieves a list of all registered users. This is an admin-only route.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched the list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request.
 */
protectedRoutes.get('/', getAllUsers)

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - User
 *       - Super Admin
 *     summary: Create a new user
 *     description: This endpoint registers a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Invalid input.
 */
reservedRoutes.post('/', createUser)

/**
 * @swagger
 * /users/{userID}:
 *   delete:
 *     tags:
 *       - User
 *       - Super Admin
 *     summary: Delete a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userID
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user to delete.
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       400:
 *         description: Invalid userID or Bad Request.
 *       404:
 *         description: User not found.
 */
reservedRoutes.delete('/:userID(\\d+)', deleteUser)

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *       - User Login
 *     summary: User Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: User Login Successful
 *       400:
 *         description: Bad Request for user login
 *       401:
 *         description: Invalid LoginID for user
 *       403:
 *         description: Invalid Password for user
 */
privateRoutes.post('/login', userLogin)

/**
 * @swagger
 * /users/{userID}:
 *   get:
 *     tags:
 *       - User Info
 *       - Super Admin
 *     summary: Get User Info
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         description: The ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User info found successfully
 *       400:
 *         description: Invalid userID
 */
sharedRoutes.get('/:userID(\\d+)', getUserInfo)

/**
 * @swagger
 * /users/{userID}:
 *   put:
 *     tags:
 *       - User Update
 *       - Super Admin
 *     summary: Update User Details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User detail updated successfully
 *       400:
 *         description: Bad Request
 */
sharedRoutes.put('/:userID(\\d+)', updateUser)

/**
 * @swagger
 * /users/{userID}:
 *   patch:
 *     tags:
 *       - User Patch
 *       - Super Admin
 *     summary: Patch User Info
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         description: The ID of the user to patch.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPatch'
 *     responses:
 *       200:
 *         description: User info patched successfully
 *       400:
 *         description: Bad Request
 */
sharedRoutes.patch('/:userID(\\d+)', patchUser)

const userRouter = { privateRoutes, sharedRoutes, protectedRoutes, reservedRoutes }

module.exports = { userRouter }