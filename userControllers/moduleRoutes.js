const express = require('express');
const userApis=require('./apis/userManagement/routes')
const adminApis=require('./apis/adminManagement/routes')

const router = express.Router();
router.use('/user/', userApis);
router.use('/admin/', adminApis);


module.exports = router;