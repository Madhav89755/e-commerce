const express = require('express');
const userApis=require('./apis/userManagement/routes')

const router = express.Router();
router.use('/auth/', userApis);


module.exports = router;