const express = require('express');
const router = express.Router();

// routes
const productRoutes=require('./productsControllers/moduleRoutes')
const userRoutes=require('./userControllers/moduleRoutes')
const orderRoutes=require('./ordersControllers/moduleRoutes')



// This file contains all the parent routes for this application
router.use('/', productRoutes);
router.use('/orders/', orderRoutes);
router.use('/', userRoutes);

module.exports = router;

