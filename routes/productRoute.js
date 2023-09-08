const express = require("express");
const {
    createProduct,
    getAllProducts,
    getAdminProducts,
    deleteProduct,
    getProductDetails,
    updateProduct,
  } = require("../controllers/productController");
  const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
  
const router = express.Router();

router.route("/products").get(getAllProducts);

router.route("/product/:id").get(getProductDetails);

router.route("/admin/products").get(isAuthenticatedUser,authorizeRoles("admin") , getAdminProducts);

router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin"),createProduct);

router.route("/admin/product/:id").delete(isAuthenticatedUser, authorizeRoles("admin"),deleteProduct)
                                  .put(isAuthenticatedUser, authorizeRoles("admin"),updateProduct);

module.exports = router;

