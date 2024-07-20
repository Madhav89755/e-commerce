const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../../database");
const UserModel = require("../../userControllers/models/userModel")

const OrderModel = sequelize.define(
  "Order",
  {
    order_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    user_id:{
      type: DataTypes.UUID,
      references:{
        model: UserModel,
        key:"user_id"
      },
      allowNull:false
    },
    status:{
      type: DataTypes.STRING,
      defaultValue: "created",
      validate:{
        isIn:[["created", "paid", "shipped"]]
      }
    },
    shipping_address:{
      type: DataTypes.JSON,
      defaultValue:{}
    },
    total_amount:{
      type: DataTypes.DECIMAL,
      defaultValue:0,
      validate: {
        min: 0,
      },
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue:"INR"
    },
    paid_on:{
      type: DataTypes.DATE,
    }
  },
  {}
);

module.exports = OrderModel;
