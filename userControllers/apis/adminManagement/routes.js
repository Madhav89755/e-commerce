const express = require('express');
const bodyParser = require('body-parser');
const userListController = require('./userList');


const router = express.Router();
router.use(bodyParser.json());


router.get('/user-list/', userListController.fetchUserList);

module.exports = router;