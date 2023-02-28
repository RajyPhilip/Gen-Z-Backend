const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');


// create new order
exports.newOrder = catchAsyncErrors( async (req,res,next)=>{

    const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice}=req.body ;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo:{
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        },
        paidAt: Date.now(),
        user:req.user._id,
    });

    res.status(201).json({
        success:true,
        order
    })
});

// get Single order detail 
exports.getSingleOrderdetail = catchAsyncErrors( async (req,res,next)=>{
    const order = await Order.findById(req.params.id).populate('user','name email');

    if(!order){
        return next(new ErrorHandler("order not found with this id",404));
    }

    res.status(200).json({
        success:true,
        order
    })
});

// get logged in user  orders  
exports.myOrders = catchAsyncErrors( async (req,res,next)=>{
    const orders = await Order.find({user:req.user._id});

    if(!orders){
        return next(new ErrorHandler("all orders by user  not found ",404));
    }

    res.status(200).json({
        success:true,
        orders
    })
});

// get all orders --admin  
exports.getAllOrders = catchAsyncErrors( async (req,res,next)=>{
    
    const orders = await Order.find();

    let totalAmount= 0 ;

    orders.forEach(order=>{
        totalAmount += order.totalPrice
        console.log(order.totalPrice)
    })

    res.status(200).json({
        success:true,
        orders,
        totalAmount
    })
});


// update order status --admin  
exports.updateOrder = catchAsyncErrors( async (req,res,next)=>{
    
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler(" order not found ",404));
    }

    if(order.orderStatus ==="Delivered"){
        console.log("order is already been delivered " )
        return next(new ErrorHandler("You have already delivered this order ",404))
    };

    // order.orderItems.forEach(async(ord)=>{
    //     await updateStock(ord.product,ord.quantity) ;
    // });

    order.orderStatus = req.body.status ;

    if(req.body.status ==='Delivered'){
    order.deliveredAt = Date.now() ;
    }

    await order.save({
        validateBeforeSave:false
    }) ;

    res.status(200).json({
        success:true
    })
});

async function updateStock(id,quantity){
    console.log("updating stock by :", quantity)
    const product = Product.findById(id);
    product.Stock-=quantity ;
    await product.save({validateBeforeSave:false});
};



// delete order --admin  
exports.deleteOrder = catchAsyncErrors( async (req,res,next)=>{
    
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler(" order not found ",404));
    }
    await order.remove();

    res.status(200).json({
        success:true
    })
});