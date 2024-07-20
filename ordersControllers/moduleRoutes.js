const express = require('express');
const orderApis=require('./apis/order/routes')
const orderItemsApis=require('./apis/orderItems/routes')

const router = express.Router();
router.use('/', orderApis);
router.use('/items/', orderItemsApis);


module.exports = router;