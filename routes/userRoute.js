const express = require("express");
const router = express.Router() ;
const UserController = require('../controllers/userController');

const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");

router.post('/register',UserController.registerUser);
router.post('/login',UserController.loginUser);
router.get('/logout',UserController.logout);
router.post('/password/forgot',UserController.forgotPassword);
router.put('/password/reset/:token',UserController.resetPassword);
router.get('/profile',isAuthenticatedUser,UserController.userDetails);
router.put('/password/update',isAuthenticatedUser,UserController.updatePassword);
router.put('/update/profile',isAuthenticatedUser,UserController.updateProfile);

router.get('/admin/allusers',isAuthenticatedUser ,authorizeRoles("admin") ,UserController.getAllUsers);
router.get('/admin/user/:id',isAuthenticatedUser ,authorizeRoles("admin") ,UserController.getSingleUser);
router.put('/admin/makeadmin/:id',isAuthenticatedUser ,authorizeRoles("admin") ,UserController.makeAdmin);
router.put('/admin/deleteuser/:id',isAuthenticatedUser ,authorizeRoles("admin") ,UserController.deleteUser);





module.exports = router ;