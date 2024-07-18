const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../../database");
const CategoryModel = require("./categoryModel");

const ProductModel = sequelize.define(
  "Products",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 50],
      },
    },
    description: {
      type: DataTypes.STRING,
    },
    category_id: {
      type: DataTypes.UUID,
      references: {
        model: CategoryModel,
        key: "id",
      },
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: "INR",
    },
    stock_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  },
  {
    // Other model options go here
  }
);

module.exports = ProductModel;
