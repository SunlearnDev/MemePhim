const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    swagger: '2.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for our application',
    },
    host: 'localhost:3003',
    basePath: '/', 
  },
  apis: ['../controller/**.js'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
