const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0', // This is the version of OpenAPI that swagger-ui-express uses
    info: {
        title: 'Your API Documentation',
        version: '1.0.0',
        description: 'A simple RESTful API documentation with Swagger-JSDoc',
    },
    servers: [
        {
            url: 'http://localhost:5800', // Update with your server URL
            description: 'Development server',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./src/routers/**/*.js'], // Files containing API annotations
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;