const express = require('express');
const router = express.Router();

// models
const productModels = require('./productsControllers/models/index')
const userModels = require('./userControllers/models/index')
const orderModels = require('./ordersControllers/models/index')

// routes
const productRoutes=require('./productsControllers/moduleRoutes')
const userRoutes=require('./userControllers/moduleRoutes')
const orderRoutes=require('./ordersControllers/moduleRoutes')



// This file contains all the parent routes for this application
router.use('/', productRoutes);
router.use('/orders/', orderRoutes);
router.use('/', userRoutes);

module.exports = {router, productModels, userModels, orderModels};

