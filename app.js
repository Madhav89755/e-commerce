const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
const sequelize = require("./database");
const morgan = require("morgan");
const swagger = require("./swagger");
const swaggerUi = require("swagger-ui-express");
const options = require("./swagger");

const port = process.env.PORT || 3000;
const app = express();

require("dotenv").config();

// app.use(morgan('dev'))
app.use("/", routes);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(options, {
    explorer: true,
    swaggerOptions: {
      tagsSorter: "alpha", // Sort tags alphabetically
      operationsSorter: "alpha", // Sort operations alphabetically
    },
  })
);

app.listen(port, async () => {
  try {
    sequelize.authenticate();
    console.log("Connection has been established successfully.");
    console.log(`Example app listening at http://localhost:${port}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
