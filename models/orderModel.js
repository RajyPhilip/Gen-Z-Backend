const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

    shippingInfo:{
        address:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },
        pinCode:{
            type:Number,
            required:true
        },
        phoneNo:{
            type:Number,
            required:true
        },
    },
    orderItems:[
        {
            name:{
                type:String,
                required:true
            },
            price:{
                type:Number,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            image:{
                type:String,
                required:true
            },
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'product',
                required:true
            },
        }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        requied:true
    },
    paymentInfo:{
        id:{
            type:String,
            
        },
        status:{
            type:String,
            
        },
        paidAt:{
            type:Date,
        },
        itemsPrice:{
            type:Number,
            default:0,
        
        },
        taxPrice:{
            type:Number,
            default:0,
        
        },
        shippingPrice:{
            type:Number,
            default:0,
            
        },
        totalPrice:{
            type:Number,
            default:0,
            
        },
    },
    orderStatus:{
        type:String,
        
        default:"Processing"
    },
    deliveredAt : Date,
    createdAt:{
        type:Date,
        default:Date.now
    }
}) ;

const Order = mongoose.model('order', orderSchema);
module.exports = Order ;