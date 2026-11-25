// load env
import './services/env-config.service.js'

// External dependencies start here
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swagger.js'

import os from 'node:os'
import cluster from 'node:cluster'

// External dependencies end here

// Internal dependencies start here

import { appRouter } from './app.router.js'
import { envs } from './services/environment.service.js'
import { handleGlobalErrors } from './handlers/_global/error-global.handler.js'
import { closeAllRedisClients } from './services/redis.service.js'
// const { auth } = require('./services/auth.service')
const numOfCores = os.availableParallelism()
const allowedOrigins = [`http://localhost:${envs.port}`]

// Internal dependencies end here


// server instantiation starts here

let server

// instantiate with cluster module
if (envs.use_cluster_module === 'true' && cluster.isPrimary) {
    console.log('number of cores available:', numOfCores)

    const spawnWorker = () => {
        const worker = cluster.fork()

        worker.on('exit', (code, signal) => {
            if (signal) {
                console.warn(`Worker ${worker.process.pid} killed by signal: ${signal}`)
            } else if (code !== 0) {
                console.warn(`Worker ${worker.process.pid} crashed with code: ${code}`)
            } else {
                console.info(`Worker ${worker.process.pid} exited cleanly.`)
            }

            // Respawn only on unexpected crash and when primary is NOT shutting down
            if (!isShuttingDown && code !== 0 && !signal) {
                console.info('Spawning replacement worker in 1s...')
                setTimeout(spawnWorker, 1000)
            }
        })
    }

    for (let i = 0; i < numOfCores; i++) {
        spawnWorker()
    }

} else {
    // App Initializations here
    const app = express()

    // Middlewares start here

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cors({ origin: allowedOrigins, credentials: true })) // Improved CORS
    app.use(compression())

    // Safely load the swagger doc
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    app.use(helmet())
    // app.use(auth)
    // Middlewares end here

    // Route mappings start here

    app.use(appRouter)
    // Route mappings end here

    // Single global error handler for everything (middlewares + routes + 404s)
    app.use(handleGlobalErrors)

    server = app.listen(envs.port, () => console.info(`Server cluster started, listening at: ${envs.port}`))
}

// server instantiation ends here
// Unified Graceful Shutdown & Fatal Error Handlers (runs for both Primary & Workers)
let isShuttingDown = false

const gracefulShutdown = async (exitCode = 0, reason = 'SIGTERM') => {
    if (isShuttingDown) return
    isShuttingDown = true

    console.info(`[Shutdown] Initiating shutdown (${reason}) on PID ${process.pid}...`)

    const forceExitTimer = setTimeout(() => {
        console.error('[Shutdown] Forced exit after timeout')
        process.exit(exitCode || 1)
    }, 10_000)
    forceExitTimer.unref()

    try {
        // Primary process: tell all workers to shut down gracefully
        if (cluster.isPrimary && envs.use_cluster_module === 'true') {
            for (const id in cluster.workers) {
                cluster.workers[id]?.kill('SIGTERM')
            }
        }

        // Worker / single-process: close HTTP server and Redis connections
        if (server) {
            await new Promise((resolve) => server.close(resolve))
        }
        await closeAllRedisClients()
    } catch (cleanupErr) {
        console.error('[Shutdown] Error during cleanup:', cleanupErr)
    } finally {
        process.exit(exitCode)
    }
}

process.on('SIGTERM', () => gracefulShutdown(0, 'SIGTERM'))
process.on('SIGINT', () => gracefulShutdown(0, 'SIGINT'))

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason)
    gracefulShutdown(1, 'unhandledRejection')
})

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err)
    gracefulShutdown(1, 'uncaughtException')
})