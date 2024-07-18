const express = require("express");
const bodyParser = require("body-parser");
const productListController = require("./product");
const { authenticate_admin } = require("../../../utils/middleware/verifyToken");

const router = express.Router();
router.use(bodyParser.json());

router.get("/", productListController.fetchProduct);
router.get("/:id", productListController.fetchProductDetail);
router.delete("/:id", authenticate_admin, productListController.deleteProduct);
router.patch("/:id", authenticate_admin, productListController.updateProductDetails);
router.post("/", authenticate_admin, productListController.addProductToList);

module.exports = router;
