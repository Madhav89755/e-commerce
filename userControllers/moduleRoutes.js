const express = require('express');
const userApis=require('./apis/userManagement/routes')
const adminApis=require('./apis/adminManagement/routes')
const { authenticate } = require("../utils/middleware/verifyToken");

const router = express.Router();
router.use('/user/', userApis);
router.use('/admin/', authenticate, adminApis);


module.exports = router;