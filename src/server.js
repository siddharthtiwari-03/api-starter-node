// External dependencies start here
import dotenv from 'dotenv'

dotenv.config()

// Include env files depending on the 'APP_ENV'

if (process.env.APP_ENV === 'dev')
    dotenv.config({ path: ['.env.dev'], quiet: true, override: true })
else if (process.env.APP_ENV === 'prod')
    dotenv.config({ path: ['.env.prod'], quiet: true, override: true })
else if (process.env.APP_ENV === 'stage')
    dotenv.config({ path: ['.env.stage'], quiet: true, override: true })

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swagger.js'

import os from 'os'
import cluster from 'cluster'

// External dependencies end here

// Internal dependencies start here

import { appRouter } from './app.router.js'
import { envs } from './services/environment.service.js'
// const { auth } = require('./services/auth.service')
const numOfCores = os.availableParallelism()
const allowedOrigins = [`http://localhost:${envs.port}`]

// Internal dependencies end here


// server instantiation starts here

// instantiate with cluster module
if (envs.use_cluster_module === 'true' && cluster.isPrimary) {
    console.log('number of cores available:', numOfCores)

    for (let i = 0; i < numOfCores; i++) {
        const worker = cluster.fork()
        worker.on('exit', (code, signal) => {
            if (signal) {
                console.warn(`worker was killed by signal: ${signal}`)
            } else if (code !== 0) {
                console.warn(`worker exited with error code: ${code}`)
            } else {
                console.info('worker exited!')
            }
        })
    }
    // Graceful shutdown for the master
    process.on('SIGTERM', () => {
        console.info(`Master ${process.pid} received SIGTERM, shutting down...`)
        for (const id in cluster.workers) {
            cluster.workers[id].kill()
        }
        process.exit(0)
    })

} else {
    // App Initializations here
    const app = express()

    // Middlewares start here

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cors({ origin: allowedOrigins, credentials: true })) // Improved CORS
    app.options('*any', cors())
    app.use(helmet())
    app.use(compression())
    // app.use(auth)
    // Middlewares end here

    // Route mappings start here

    // Safely load the swagger doc
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    app.use(appRouter)
    // Route mappings end here

    // Error handling middleware (Place here, before route mapping)
    app.use((err, req, res, _next) => {
        console.error(err.stack)
        res.status(500).send('Something broke!')
    })

    app.listen(envs.port, () => console.info(`Server cluster started, listening at: ${envs.port}`))

    // Graceful shutdown for the worker
    process.on('SIGTERM', () => {
        console.error(`Worker ${process.pid} received SIGTERM, shutting down...`)
        // Add server close logic here, if needed
        process.exit(0)
    })
}

// server instantiation ends here

// Global Error Handlers
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason)
    // Add logging or other specific handling here
})

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err)
    // Add logging or other specific handling here
    process.exit(1)
})