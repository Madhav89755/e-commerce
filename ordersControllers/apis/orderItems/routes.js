const express = require('express');
const bodyParser = require('body-parser');
const orderItemsController = require('./orderItems');
const { authenticate }=require("../../../utils/middleware/verifyToken")

const router = express.Router();
router.use(bodyParser.json());

/**
 * @openapi
 * /orders/items/:
 *   post:
 *     description: Add items to an unpaid order!
 *     tags: ['Order Item']
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: Product's Id.
 *                 example: Laptop
 *     responses:
 *       200:
 *         description: Item Added to order Success Success.
 */
router.post('/', authenticate, orderItemsController.addItemsToOrder)

/**
 * @openapi
 * /orders/items/{item_id}:
 *   post:
 *     description: Update Product's quantity in order!
 *     tags: ['Order Item']
 *     parameters:
 *       - in: path
 *         name: item_id
 *         required: true
 *         description: uuid of the item to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: Product's Id.
 *                 example: Laptop
 *               new_quantity:
 *                 type: integer
 *                 description: Product's Quantity to order.
 *                 example: 5
 *     responses:
 *       200:
 *         description: Product's Quantitiy Update Success.
 */
router.patch('/:item_id', authenticate, orderItemsController.updateItemQtyInOrder)


/**
 * @openapi
 * /orders/items/{item_id}:
 *   delete:
 *     description: Delete a Product from an order!
 *     tags: ['Order Item']
 *     parameters:
 *       - in: path
 *         name: item_id
 *         required: true
 *         description: uuid of the item to update.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product's Quantitiy Update Success.
 */
router.delete('/:item_id', authenticate, orderItemsController.removeItemFromOrder)

module.exports = router;