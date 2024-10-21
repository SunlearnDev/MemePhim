// swaggerOptions.js
"use strict";
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for our application',
    },
    servers: [
      {
        url: 'http://localhost:3003',
        description: 'Local server',
      },
    ],
  },
  apis: ['../routers/**/*.js'],
};

module.exports = swaggerJsdoc(swaggerOptions);
