const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./index");
const sequelize = require("./database");
const app = express();
const port = 3000;

app.use("/", routes.router);

app.listen(port, async () => {
  try {
    sequelize.authenticate()
    console.log("Connection has been established successfully.");
    console.log(`Example app listening at http://localhost:${port}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
