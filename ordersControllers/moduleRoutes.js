const express = require('express');
const orderApis=require('./apis/order/routes')
// const userApis=require('./apis/order/routes')

const router = express.Router();
router.use('/', orderApis);


module.exports = router;