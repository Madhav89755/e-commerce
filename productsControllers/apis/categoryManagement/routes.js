const express = require('express');
const bodyParser = require('body-parser');
const addCategoryController = require('./category');
const { authenticate_admin } = require("../../../utils/middleware/verifyToken")

const router = express.Router();
router.use(bodyParser.json());


/**
 * @openapi
 * /category/:
 *   get:
 *     description: Fetch Category List!
 *     tags: ['Category']
 *     security: []
 *     responses:
 *       200:
 *         description: Category List.
 */
router.get('/', addCategoryController.fetchCategoryList);

/**
 * @openapi
 * /category/{id}:
 *   get:
 *     description: Get a Category Detail!
 *     tags: ['Category']
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: uuid Id of the category to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category Detail.
 */
router.get('/:id', addCategoryController.fetchCategoryDetail);

/**
 * @openapi
 * /category/:
 *   post:
 *     description: Add a new Category! (Admin Only)
 *     tags: ['Admin - Category']
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category's name.
 *                 example: Laptop
 *               image_url:
 *                 type: string
 *                 description: Image to be associated with Category.
 *                 example: http://google.com/
 *     responses:
 *       200:
 *         description: Returns a Category Detail.
 */
router.post('/', authenticate_admin, addCategoryController.addCategory);

/**
 * @openapi
 * /category/{id}:
 *   patch:
 *     description: Update a Category! (Admin Only)
 *     tags: ['Admin - Category']
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: uuid Id of the category to update.
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
 *                 description: Category's name.
 *                 example: Laptop
 *               image_url:
 *                 type: string
 *                 description: Image to be associated with Category.
 *                 example: http://google.com/
 *     responses:
 *       200:
 *         description: Returns a Category Detail.
 */
router.patch('/:id', authenticate_admin, addCategoryController.updateCategoryDetail);

/**
 * @openapi
 * /category/{id}:
 *   delete:
 *     description: Delete a Category! (Admin Only)
 *     tags: ['Admin - Category']
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: uuid Id of the category to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category Deletion Success.
 */
router.delete('/:id/', authenticate_admin, addCategoryController.deleteCategoryDetail);



module.exports = router;