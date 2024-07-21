const express = require('express');
const bodyParser = require('body-parser');
const userListController = require('./userList');
const orderAdminController = require('./orderList')


const router = express.Router();
router.use(bodyParser.json());


router.get('/user/list/', userListController.fetchUserList);
router.get('/orders/list/', orderAdminController.getOrders);

module.exports = router;