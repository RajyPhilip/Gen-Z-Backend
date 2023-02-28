const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name :{
        type : String , 
        required : true,
        trim : true
    },
    description:{
        type : String,
        required : true , 
    },
    price :{
        type : Number ,
        required :true,
        maxLength:[8,'price cannot exceed 8 figures']
    },
    rating:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:true,
    },
    Stock:{
        type:Number,
        required:true,
        maxLength:[4,"Stock cannot exceed 4 figures"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'user'
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            },
        }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
},{
    timestamp : true
});


const Product = mongoose.model('product', productSchema);
module.exports =Product ;