const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");


const jwtSECRET = 'ecom' ;

exports.isAuthenticatedUser = catchAsyncErrors(async(req,res,next)=>{

    const {token} = req.cookies ;

    if(!token){
        return next(new ErrorHandler('please login to acess this resource',401));
    }

    const decodeData = jwt.verify(token,jwtSECRET);


    req.user = await User.findById(decodeData.id);
    
    next();
});

exports.authorizeRoles = (...roles)=>{
    return (req,res,next)=>{
        // if user then below if condtion is true else he is admin 
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`,403));
        }
        next();
    }
}
