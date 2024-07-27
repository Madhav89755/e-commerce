const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../../database');


const CategoryModel = sequelize.define(
    'Category',
    {
      id:{
        type:DataTypes.UUID,
        primaryKey:true,
        defaultValue: Sequelize.UUIDV4
      },
      category_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      image_url:{
        type: DataTypes.STRING,
        validate:{
          isUrl: true,
        }
      }
    },
    {
      // Other model options go here
    },
  );


module.exports = CategoryModel;