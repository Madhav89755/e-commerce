const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ecommerce API Documentation",
      version: "1.0.0",
      description:
        "This is a Ecommerce API application made with Express.",
      license: {
        name: "Licensed Under MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Madhav Sharma",
        url: "https://www.linkedin.com/in/madhav-sharma-448641227/",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./*/*/*/routes.js"], // files containing annotations as above
};
module.exports = swaggerJsdoc(options);
