const express = require('express');
const productApis=require('./apis/productManagement/routes')
const categoryApis=require('./apis/categoryManagement/routes')

const router = express.Router();
router.use('/products/', productApis);
router.use('/category/', categoryApis);


module.exports = router;