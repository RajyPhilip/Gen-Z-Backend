const express = require('express');
const router = express.Router();
const {isAuthenticatedUser} = require("../middleware/auth");
const PaymentController = require('../controllers/paymentController')

router.post('/payment/process',isAuthenticatedUser ,PaymentController.processPayment);
router.get('/stripeapikey' , isAuthenticatedUser ,PaymentController.sendStripeApiKey);

module.exports = router ;