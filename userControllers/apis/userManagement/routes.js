const express = require('express');
const bodyParser = require('body-parser');
const userController = require('./users');


const router = express.Router();
router.use(bodyParser.json());

router.post('/auth/register/', userController.createUser);
router.post('/auth/login/', userController.loginUser);

module.exports = router;