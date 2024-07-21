const express = require('express');
const bodyParser = require('body-parser');
const userListController = require('./userList');
const orderAdminController = require('./orderList')


const router = express.Router();
router.use(bodyParser.json());


/**
 * @openapi
 * /admin/user/list/:
 *   get:
 *     description: Fetch Users List!
 *     tags: ['Admin - User']
 *     responses:
 *       200:
 *         description: Fetch Users List.
 */
router.get('/user/list/', userListController.fetchUserList);

/**
 * @openapi
 * /admin/orders/list/:
 *   get:
 *     description: Fetch Order List!
 *     tags: ['Admin - Orders']
 *     responses:
 *       200:
 *         description: Order List.
 */
router.get('/orders/list/', orderAdminController.getOrders);

/**
 * @openapi
 * /admin/orders/{order_id}:
 *   patch:
 *     description: Confirm Order Payment Capture!
 *     tags: ['Admin - Orders']
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         description: uuid Id of the order to confirm Order Payment.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order Payment Confirmed.
 */
router.patch('/orders/:order_id', orderAdminController.confirmOrderPayment)

/**
 * @openapi
 * /admin/orders/shipped/{order_id}:
 *   patch:
 *     description: Confirm Order Shipped!
 *     tags: ['Admin - Orders']
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         description: uuid Id of the order to confirm Order Shippment.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order Shipped Confirmed.
 */
router.patch('/orders/shipped/:order_id', orderAdminController.confirmOrderShippment)


module.exports = router;