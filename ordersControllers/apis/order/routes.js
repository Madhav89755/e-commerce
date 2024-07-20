const express = require('express');
const bodyParser = require('body-parser');
const orderController = require('./order');
const { authenticate }=require("../../../utils/middleware/verifyToken")


const router = express.Router();
router.use(bodyParser.json());

router.get('/', authenticate, orderController.fetchOrderList)
router.get('/:order_id', authenticate, orderController.fetchOrderDetail)
router.post('/', authenticate, orderController.createOrder)
router.patch('/:order_id', authenticate, orderController.confirmOrderPayment)
router.patch('/shipped/:order_id', authenticate, orderController.confirmOrderShippment)
router.delete('/:order_id', authenticate, orderController.deleteUnpaidOrder)

module.exports = router;