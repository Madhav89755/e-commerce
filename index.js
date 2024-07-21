const express = require('express');
const router = express.Router();

// models
const productModels = require('./productsControllers/models/index')
const userModels = require('./userControllers/models/index')
const orderModels = require('./ordersControllers/models/index')


module.exports = { productModels, userModels, orderModels};

