const { envs } = require('./services/environment.service')

const swaggerAutoGen = require('swagger-autogen')()

const doc = {
    info: {
        title: 'Doc: Api Starter kit (NodeJs)',
        description: 'These are the auto generated documentations for this starter kit'
    },
    host: `localhost:${envs.port}`
}

const outputFile = '../swagger-output.json'
const routes = ['./app.router.js']

swaggerAutoGen(outputFile, routes, doc)