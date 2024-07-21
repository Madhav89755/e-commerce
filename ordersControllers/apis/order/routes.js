const express = require('express');
const bodyParser = require('body-parser');
const orderController = require('./order');
const { authenticate, authenticate_admin }=require("../../../utils/middleware/verifyToken")


const router = express.Router();
router.use(bodyParser.json());


/**
 * @openapi
 * /orders/:
 *   get:
 *     description: Create a new order for the current user
 *     tags: ['Orders']
 *     responses:
 *       200:
 *         description: Order List for the user Success.
*/
router.get('/', authenticate, orderController.fetchOrderList)

/**
 * @openapi
 * /orders/{order_id}:
 *   get:
 *     description: Fetch order details
 *     tags: ['Orders']
 *     responses:
 *       200:
 *         description: Order List for the user Success.
*/
router.get('/:order_id', authenticate, orderController.fetchOrderDetail)

/**
 * @openapi
 * /orders/:
 *   post:
 *     description: Create a new order for the current user
 *     tags: ['Orders']
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shipping_address:
 *                 type: object
 *                 description: Shipping address of the user.
 *                 properties:
 *                     address1:
 *                       type: string
 *                       description: Address line 1.
 *                       example: Luxury Living 2nd Floor
 *                     address2:
 *                       type: string
 *                       description: Address line 2.
 *                       example: White Field
 *                     city:
 *                       type: string
 *                       description: City Name.
 *                       example: Banglore
 *                     state:
 *                       type: string
 *                       description: State Name.
 *                       example: Karnataka
 *                     country:
 *                       type: string
 *                       description: Country Name.
 *                       example: India
 *                     zip_code:
 *                       type: string
 *                       description: Zip Code.
 *                       example: 123456
 *     responses:
 *       200:
 *         description: Order Creation Success.
 */
router.post('/', authenticate, orderController.createOrder)


/**
 * @openapi
 * /orders/{order_id}:
 *   delete:
 *     description: Delete Unpaid Order!
 *     tags: ['Orders']
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         description: uuid Id of the order to delete Order.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order Delete Success.
 */
router.delete('/:order_id', authenticate, orderController.deleteUnpaidOrder)




module.exports = router;