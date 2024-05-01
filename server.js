// External dependencies start here

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const dotenv = require('dotenv').config()

// External dependencies end here

// Internal dependencies start here

const userRoutes = require('./routers/user/user.routes')
const globalRoutes = require('./routers/global.routes')
const { PORT } = process.env

// Internal dependencies end here

// App Initializations here
const app = express()

// Middlewares start here

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())

// Middlewares end here

// Route mappings start here

app.use('/users', userRoutes)
app.use(globalRoutes)

// Route mappings end here

app.listen(PORT, () => console.log(`Server started, listening at: ${PORT}`))