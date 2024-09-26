// src/config/swagger.js

const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Node.js API', // Title of your API
    version: '1.0.0', // Version of the API
    description: 'Documentation for the Node.js API', // Description
    contact: {
      name: 'API Support',
      email: 'support@example.com', // Update with your contact email
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 4000}`, // Local server URL
    },
    {
      url: 'https://kittybee.api.ithemes.xyz', // New server URL
    },
  ],

};

const options = {
  swaggerDefinition,
  // Paths to files where API documentation is defined
  apis: ['./src/routes/*.js'], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
