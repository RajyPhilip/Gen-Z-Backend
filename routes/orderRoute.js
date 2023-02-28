const express = require("express");
const orderController = require("../controllers/orderController");
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");

const router = express.Router() ;

router.post('/order/new',isAuthenticatedUser,orderController.newOrder);

router.get('/order/:id',isAuthenticatedUser,authorizeRoles('admin'),orderController.getSingleOrderdetail);

router.get('/orders/me',isAuthenticatedUser,orderController.myOrders);

router.get('/admin/orders',isAuthenticatedUser,authorizeRoles("admin"),orderController.getAllOrders);

router.put('/admin/order/:id',isAuthenticatedUser,authorizeRoles("admin"),orderController.updateOrder);

router.put('/admin/deleteorder/:id',isAuthenticatedUser,authorizeRoles("admin"),orderController.deleteOrder);

module.exports = router ;