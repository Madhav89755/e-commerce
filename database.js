const { Sequelize } = require("sequelize");
require("dotenv").config();


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    logging:false,
    dialect:process.env.DB_DIALECT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // You might need to adjust this based on your SSL certificate
      }
    }
  },
);



module.exports = sequelize;