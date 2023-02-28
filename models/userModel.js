const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name :{
        type : String , 
        required : [true,'Please Enter Your Name'],
        maxLength:[25,'Name Cannot exceed 25 characters'],
    },
    email:{
        type : String,
        required : [true,'Please Enter Your Name'] , 
        unique : true ,
        validate:[validator.isEmail,"please Enter a Valid Email"]
    },
    password :{
        type : String ,
        required :[true,'Please Enter Your Password'],
        password:[8,'Password should greater then 8 characters'],
        select:false 
    },
    avatar:{
            public_id:{
                type:String,
                
            },
            url:{
                type:String,
                
            }
    },
    role:{
        type:String,
        default:"user",
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date ,
});

//make hash password
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password,10)
});

//compare hash password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

//generating password reset token
userSchema.methods.getResetPasswordToken = function(){
    
    const resetToken = crypto.randomBytes(20).toString('hex');// generating token 

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');//hashing and adding to user schema 
    
    this.resetPasswordExpire = Date.now() + 15 *60 *1000 ;// setting expire time

    return resetToken ;

}


//JWT TOKEN
const jwtSECRET = 'ecom' ;
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},jwtSECRET,{
        expiresIn: '5d' 
    });
};

const User = mongoose.model('user', userSchema);
module.exports =User ;