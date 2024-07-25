const express = require("express");
const bodyParser = require("body-parser");
const productListController = require("./product");
const { authenticate_admin } = require("../../../utils/middleware/verifyToken");

const router = express.Router();
router.use(bodyParser.json());

/**
 * @openapi
 * /products/:
 *   get:
 *     description: Fetch Product List!
 *     tags: ['Products']
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by exact product name
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: string
 *         description: Filter by exact category id
 *     security: []
 *     responses:
 *       200:
 *         description: Returns a Product List.
 */
router.get("/", productListController.fetchProduct);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     description: Fetch Product Details!
 *     tags: ['Products']
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: uuid Id of the product to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns a Product Detail.
 */
router.get("/:id", productListController.fetchProductDetail);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     description: Delete a Product!
 *     tags: ['Admin - Products']
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: uuid Id of the product to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product Deletion Success.
 */
router.delete("/:id", authenticate_admin, productListController.deleteProduct);

/**
 * @openapi
 * /products/{id}:
 *   patch:
 *     description: Update Product Details!
 *     tags: ['Admin - Products']
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: uuid Id of the product to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product's name.
 *                 example: Laptop
 *               description:
 *                 type: string
 *                 description: Product's Description.
 *                 example: HP 15 inch i5 Laptop
 *               price:
 *                 type: decimal
 *                 description: Product's Price.
 *                 example: 50000
 *               currency:
 *                 type: string
 *                 description: Product's Price Currency.
 *                 example: INR
 *               stock_count:
 *                 type: integer
 *                 description: Product's current stock.
 *                 example: 10
 *               category_id:
 *                 type: string
 *                 description: Category Id.
 *     responses:
 *       200:
 *         description: Returns a Product Detail.
 */
router.patch("/:id", authenticate_admin, productListController.updateProductDetails);

/**
 * @openapi
 * /products/:
 *   post:
 *     description: Add a new Product! (Admin Only)
 *     tags: ['Admin - Products']
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: string
 *                 description: Category Id.
 *               product:
 *                 type: object
 *                 description: Product Details.
 *                 properties:
 *                     name:
 *                       type: string
 *                       description: Product's name.
 *                       example: Laptop
 *                     description:
 *                       type: string
 *                       description: Product's Description.
 *                       example: HP 15 inch i5 Laptop
 *                     price:
 *                       type: decimal
 *                       description: Product's Price.
 *                       example: 50000
 *                     currency:
 *                       type: string
 *                       description: Product's Price Currency.
 *                       example: INR
 *                     stock_count:
 *                       type: integer
 *                       description: Product's current stock.
 *                       example: 10
 *     responses:
 *       200:
 *         description: Returns a Product Detail.
 */
router.post("/", authenticate_admin, productListController.addProductToList);

module.exports = router;
