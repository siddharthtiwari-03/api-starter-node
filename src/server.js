// External dependencies start here

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
require('dotenv').config()

// Include env files depending on the 'MODE'

if (process.env.MODE === 'dev')
    require('dotenv').config({ path: ['.env.dev'] })
else if (process.env.MODE === 'prod')
    require('dotenv').config({ path: ['.env.prod'] })
else if (process.env.MODE === 'stage')
    require('dotenv').config({ path: ['.env.stage'] })

const os = require('os')
const cluster = require('cluster')

// External dependencies end here

// Internal dependencies start here

const appRouter = require('./app.router')
const { envs } = require('./services/environment.helper')

// Internal dependencies end here

// App Initializations here
const app = express()
const whiteListedDomains = ['http://localhost:' + envs.port, '*']
const numOfCores = os.availableParallelism()

// Middlewares start here

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: whiteListedDomains, credentials: true }))
app.options('*', cors())
app.use(helmet())
app.use(compression())

// Middlewares end here

// Route mappings start here

app.use(appRouter)

// Route mappings end here

// server instantiation starts here

// instantiate with cluster module
if (envs.use_cluster_module === 'true' && cluster.isPrimary) {
    console.log('number of cores available:', numOfCores)

    // for (let i = 0; i <= numOfCores; i++) {
    for (let i = 0; i <= 1; i++) {
        const worker = cluster.fork()
        worker.on('exit', (code, signal) => {
            if (signal) {
                console.log(`worker was killed by signal: ${signal}`)
            } else if (code !== 0) {
                console.log(`worker exited with error code: ${code}`)
            } else {
                console.log('worker success!')
            }
        })
    }
} else {
    app.listen(envs.port, () => console.log(`Server cluster started inside src, listening at: ${envs.port}`))
}

// app.listen(envs.port, () => console.log(`Server started inside src, listening at: ${envs.port}`))

// server instantiation ends here