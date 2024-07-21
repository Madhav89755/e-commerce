const express = require('express');
const bodyParser = require('body-parser');
const userController = require('./users');


const router = express.Router();
router.use(bodyParser.json());
/**
 * @openapi
 * /user/auth/register/:
 *   post:
 *     description: Register to the platform
 *     tags: ['Authentication']
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 description: User's name.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 description: User's Password.
 *               is_admin:
 *                 type: boolean
 *                 description: Is User an admin user.
 *                 default: false
 *     responses:
 *       200:
 *         description: User Creation Success.
*/
router.post('/auth/register/', userController.createUser);

/**
 * @openapi
 * /user/auth/login/:
 *   post:
 *     description: Fetch the auth_token for login
 *     tags: ['Authentication']
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 description: User's Password.
 *     responses:
 *       200:
 *         description: User Logged in Success.
*/
router.post('/auth/login/', userController.loginUser);

module.exports = router;