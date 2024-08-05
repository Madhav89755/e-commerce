const express = require('express');
const bodyParser = require('body-parser');
const userController = require('./users');
const userProfile=require('./userProfile')

const { authenticate } = require('../../../utils/middleware/verifyToken');

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

/**
 * @openapi
 * /user/profile/:
 *   get:
 *     description: Fetch the profile details of the logged in user
 *     tags: ['User Profile']
 *     responses:
 *       200:
 *         description: User Profile data.
*/
router.get('/profile/', authenticate, userProfile.userProfileData);

/**
 * @openapi
 * /user/auth/update-password/:
 *   post:
 *     description: Update the password of the account
 *     tags: ['Authentication']
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: User's current Password.
 *               newPassword:
 *                 type: string
 *                 description: User's new Password.
 *     responses:
 *       200:
 *         description: User password update Success.
*/
router.post('/auth/update-password/', authenticate, userProfile.updatePassword);

module.exports = router;