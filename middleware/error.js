const ErrorHandler = require('../utils/errorHandler');




module.exports= (err,req,res,next)=>{
    err.statusCode = err.statusCode ||500 ;
    err.message = err.message || "Internal server Error" ;

//mongoose duplicate key error 
if(err.code === 11000){
    const message= `duplicate ${Object.keys(err.keyValue)} Entered` ;
    err = new ErrorHandler(message,400);
}
//wrong jwt  error 
if(err.name === 'JsonWebTokenError'){
    const message= `Json Web Token is Invalid,try again` ;
    err = new ErrorHandler(message,400);
}

//JWT expire  error 
if(err.name === 'TokenExpireError'){
    const message= `Json Web Token is Expire,try again` ;
    err = new ErrorHandler(message,400);
}

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    });
}