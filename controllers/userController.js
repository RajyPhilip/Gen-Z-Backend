const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const { findById } = require('../models/userModel');
const cloudinary = require('cloudinary').v2;


// register a user 
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{

    const myCloud = await cloudinary.uploader.upload(req.body.avatar ,{
        folder:"avatars",
        width:150,
        crop:"scale"
    });

    const {name,email,password} = req.body ;


    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:myCloud.public_id,
            url: myCloud.secure_url
        }
    });

    sendToken(user,201,res);
});


// login user 
exports.loginUser =  catchAsyncErrors(async(req,res,next)=>{
    const {email,password} = req.body ;
    if(!email || !password){
        return next(new ErrorHandler('Please enter Email & password',400))
    };
    const user = await User.findOne({email}).select('+password');

    if(!user){
        return next(new ErrorHandler(' Invalid Email or password',401));
    }
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler(' Invalid Email or password',401));
    }

    sendToken(user,200,res);
});

//logout user 

exports.logout = catchAsyncErrors(async(req,res,next)=>{

    res.cookie('token',null,{
        expiresin : new Date(Date.now()),
        httpOnly:true 
    });

    res.status(200).json({
        success:true,
        message:"Logged Out"
    });
});

//forgot password 
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("user not found",404));
    };
    //get reset password token 
    const resetToken = await user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}` ;

    const message = `your password reset token is:- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it`;

    try {
        await sendEmail({
            email:user.email,
            subject:` password recovery`,
            message
        });
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} Succesfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined ;
        user.resetPasswordExpire = undefined ;

        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message,500));
    }

});


// reset password url from nodemailer 
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{
    //creating token hash
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');//hashing and adding to user schema 

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt : Date.now() }
    });

    if(!user){
        return next(new ErrorHandler("Reset password token is invalid or has been expired",400));
    }

    if(req.body.passwprd !== req.body.confirmPassword){
        return next(new ErrorHandler("password does not match ",400));
    }

    user.password = req.body.password ;
    user.resetPasswordToken = undefined ;
    user.resetPasswordExpire = undefined ;

    await user.save();

    sendToken(user,200,res) ;

});

//get user details
exports.userDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    })
});


//update user password
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched= await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect",400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler(" password does not match ",400));
    }
    user.password = req.body.newPassword ;
    await user.save();

    sendToken(user,200,res);
});



//update user profile
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{

    const newUserData={
        name:req.body.name,
        email:req.body.email
    }
    if(req.body.avatar !== ""){
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;

        await cloudinary.uploader.destroy(imageId);

        const myCloud = await cloudinary.uploader.upload(req.body.avatar ,{
            folder:"avatars",
            width:150,
            crop:"scale"
        });
        
        newUserData.avatar = {
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })

    await user.save();

    res.status(200).json({
        success:true
    });
});

//get all users   --admin
exports.getAllUsers = catchAsyncErrors(async(req,res,next)=>{

    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    })
});

//get  user info   --admin
exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`user does not exists with id : ${req.params.id}`))
    }

    res.status(200).json({
        success:true,
        user
    })
});


//update  user role to admin  --admin
exports.makeAdmin = catchAsyncErrors(async(req,res,next)=>{

    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }


    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })

    
    await user.save();
    res.status(200).json({
        success:true,
        user
    })
});


//delete  user --admin
exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{

    const user =await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`user does not exists with : ${req.params.id}`))
    }

    await user.remove();

    res.status(200).json({
        success:true,
        message:"user deleted successfully"
        
    })
});