const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../../database");
const OrderModel = require("./orderModel");
const ProductModel = require("../../productsControllers/models/productModel");

const OrderItemModel = sequelize.define(
  "OrderItem",
  {
    item_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    order_id: {
      type: DataTypes.UUID,
      references: {
        model: OrderModel,
        key: "order_id",
      },
      allowNull: false,
    },
    product_id: {
      type: DataTypes.UUID,
      references: {
        model: ProductModel,
        key: "id",
      },
      allowNull: false,
    },
    quantity:{
        type: DataTypes.INTEGER,
        defaultValue:0,
        validate:{
            min:0
        }
    }
  },
  {}
);

module.exports = OrderItemModel;
