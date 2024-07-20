const express = require('express');
const bodyParser = require('body-parser');
const orderItemsController = require('./orderItems');
const { authenticate }=require("../../../utils/middleware/verifyToken")

const router = express.Router();
router.use(bodyParser.json());

router.post('/', authenticate, orderItemsController.addItemsToOrder)
router.patch('/:item_id', authenticate, orderItemsController.updateItemQtyInOrder)
router.delete('/:item_id', authenticate, orderItemsController.removeItemFromOrder)

module.exports = router;