const STRIPE_API_KEY = "pk_test_51McDMaSAMlevFXjj1jrvKRBxN3lLwHvuRAxZHQGaMZsvKVYkx9Ul5VsR6fECKPzSAlVpUT8G8YcRznXYnjmfDw3l006BOFrqFN" ;  

const STRIPE_SECRET_KEY = "sk_test_51McDMaSAMlevFXjjZMY7TZ1toShAXoGLgCzzQMB6b8lgnBTWozY7X0VkzNFouyCewnopJjQh3pRXCYFH0HBB1E0d00hLwmCYJj" ;

const stripe = require('stripe')(STRIPE_SECRET_KEY);
const catchAsyncErrors = require('../middleware/catchAsyncErrors');



exports.processPayment = catchAsyncErrors(async(req,res,next)=>{
    const myPayment = await stripe.paymentIntents.create({
        amount:req.body.amount,
        currency:"inr",
        metadata:{
            company:"GEN-Z"
        }
    });
    res.status(200).json({
        success:true,
        client_secret:myPayment.client_secret
    })
});

exports.sendStripeApiKey = catchAsyncErrors(async (req,res,next)=>{
    res.status(200).json({
        stripeApiKey : "pk_test_51McDMaSAMlevFXjj1jrvKRBxN3lLwHvuRAxZHQGaMZsvKVYkx9Ul5VsR6fECKPzSAlVpUT8G8YcRznXYnjmfDw3l006BOFrqFN"
    })
})