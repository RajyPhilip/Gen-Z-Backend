const express = require("express");
const productController = require("../controllers/productController");
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");

const router = express.Router() ;


router.get('/products', productController.getAllProducts);
router.get('/admin/products',isAuthenticatedUser ,authorizeRoles("admin") , productController.AdminGetAllProducts);

router.post('/products/new' ,isAuthenticatedUser ,authorizeRoles("admin") , productController.createProduct);

router.put('/products/update/:id' ,isAuthenticatedUser ,authorizeRoles("admin") , productController.updateProduct);

router.put('/products/delete/:id' ,isAuthenticatedUser ,authorizeRoles("admin") , productController.deleteProduct);

router.get('/products/details/:id' , productController.getproductDetails);

router.put('/review',isAuthenticatedUser,productController.createProductReview);

router.get('/allreviews',productController.getProductReviews);



router.get('/deletereview',isAuthenticatedUser,authorizeRoles("admin"),productController.deleteReview);



module.exports = router ;