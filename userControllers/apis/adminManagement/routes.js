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
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: Filter by exact user_id
 *       - in: query
 *         name: full_name
 *         schema:
 *           type: string
 *         description: Filter by Full name of user
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by exact email
 *       - in: query
 *         name: is_admin
 *         schema:
 *           type: boolean
 *         description: Filter the users that are admin
 *     responses:
 *       200:
 *         description: Fetch Users List.
 */
router.get('/user/list/', userListController.fetchUserList);

/**
 * @openapi
 * /admin/user/active/status/:
 *   post:
 *     description: Update User Active Status!
 *     tags: ['Admin - User']
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: User ID to perform action on.
 *               action:
 *                 type: string
 *                 description: Action to perform values can be either activate or deactivate.
 *     responses:
 *       200:
 *         description: User Active Status Updated .
 */
router.post('/user/active/status', userListController.updateUserActiveStatus);

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