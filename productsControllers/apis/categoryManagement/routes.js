const express = require('express');
const bodyParser = require('body-parser');
const addCategoryController = require('./category');
const { authenticate_admin } = require("../../../utils/middleware/verifyToken")

const router = express.Router();
router.use(bodyParser.json());

router.get('/', addCategoryController.fetchCategoryList);
router.get('/:id', addCategoryController.fetchCategoryDetail);
router.post('/', authenticate_admin, addCategoryController.addCategory);
router.patch('/:id', authenticate_admin, addCategoryController.updateCategoryDetail);
router.delete('/:id/', authenticate_admin, addCategoryController.deleteCategoryDetail);



module.exports = router;