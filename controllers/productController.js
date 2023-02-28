const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');




// get all products 
exports.getAllProducts = catchAsyncErrors( async (req,res,next)=>{

    const resultPerPage = 8 ;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resultPerPage) ;
    
    
    const products = await apiFeature.query ;
    res.status(200).json({
        success:true,
        products:products,
        productsCount,
        resultPerPage,
    });
});

// get all products --ADMIN
exports.AdminGetAllProducts = catchAsyncErrors( async (req,res,next)=>{

    const products = await Product.find();


    
    res.status(200).json({
        success:true,
        products
    });
});


//create Product -- Admin
exports.createProduct = catchAsyncErrors(async(req,res,next)=>{
    let product ;
    try {
        let images=[];
            if(typeof req.body.images ==='string'){
                images.push(req.body.images);
            }else{
                images = req.body.images ;
            }
        const imagesLinks=[];
            for(let i = 0 ;i< images.length ;i++){
                const result = await cloudinary.v2.uploader.upload(images[i],{
                    folder:"products",
                });
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                })
            }
        req.body.images = imagesLinks ;
        req.body.user = req.user.id ;
        product = await Product.create(req.body);
    } catch (error) {
        console.log("ERRorrr$$",error);
    }


    res.status(201).json({
        success:true,
        product:product
    })
});


// update products --Admin
exports.updateProduct = catchAsyncErrors(async (req,res,next)=>{
    
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found cannot update",404)) ;
    }
    //images start here
    let images=[];
    if(typeof req.body.images ==='string'){
        images.push(req.body.images);
    }else{
        images = req.body.images ;
    }
    if(images !== undefined){
        //delete image from cloudinary
        for(let i = 0 ;i <product.images.length ;i++){
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }
        const imagesLinks=[];
        for(let i = 0 ;i< images.length ;i++){
            const result = await cloudinary.v2.uploader.upload(images[i],{
                folder:"products",
            });
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }
        req.body.images = imagesLinks
    }


    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        product:product
    });
})

// delete products --Admin
exports.deleteProduct = catchAsyncErrors(async (req,res,next)=>{
    let product = await Product.findByIdAndDelete(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found cannot delete",404)) ;
    }
    for(let i = 0 ;i <product.images.length ;i++){
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    return res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    });
})

// get details of product
exports.getproductDetails = catchAsyncErrors( async (req,res,next)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404)) ;
    }

    return res.status(200).json({
        success:true,
        product:product
    });
});

//create new review or update the review 
exports.createProductReview = catchAsyncErrors( async (req,res,next)=>{

    const {rating, comment,productId}=req.body
    
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(reviewed=> review.user.toString()===req.user._id)

    if(isReviewed){
        product.reviews.forEach(review =>{
            if(review.user.toString()===req.user._id){
                review.rating=rating ;
                review.comment=comment
            }

        })
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length ;
    }
    let avg=0;
    product.reviews.forEach(rev=>{
        avg +=rev.rating
    });

    product.rating = avg/product.reviews.length ;

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
    });

});



//get all reviews of a product
exports.getProductReviews = catchAsyncErrors( async (req,res,next)=>{

    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    };

    res.status(200).json({
        success:true,
        reviews:product.reviews
    });
});

//Delete Review
exports.deleteReview = catchAsyncErrors( async (req,res,next)=>{

    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    };

    // review which we dont want to delete 
    const reviews = product.reviews.filter(rev=> rev._id.toString()!==req.query.id.toString())
    
    // updating reviews 
    let avg=0;
    product.reviews.forEach(rev=>{
        avg +=rev.rating
    });
    const rating =  product.rating = avg/reviews.length ;

    const numOfReviews = reviews.length ;

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        rating,
        numOfReviews
    },{
        new:true,
        runValidators: true,
        useFindAndModify:false
    }) ;

    res.status(200).json({
        success:true,
    });
});

