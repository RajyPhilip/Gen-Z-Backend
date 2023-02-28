// creating token nd saving it in cookie 

const expiresin=1 ;

const sendToken = (user,statusCode,res)=>{
    const token = user.getJWTToken();
    // options for coookie
    const options={
        expiresin: new Date(
            Date.now + expiresin *24 * 60 * 60 *1000 
        ),
        httpOnly:true 
    }
    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        user,
        token
    });
};

module.exports = sendToken ;