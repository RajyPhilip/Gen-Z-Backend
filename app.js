const express= require('express');
const app = express() ;
const Database = require('./config/mongoose');
const dotenv = require('dotenv');

app.use(express.json());

// cookieparse 
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//bodyParser   //for getting form data kind of url
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

//file upload
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// config 
dotenv.config({path:'Backend/config/config.env'});


//cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "drs05mf2a",
    api_key:"372982655122698" ,
    api_secret: "NSYQlHYtEsQZEoQPl1bNJvF5ztE",
});

//route imports
const product = require('./routes/productRoute');
app.use('/api/v1',product);

const user = require('./routes/userRoute');
app.use('/api/v1',user);

const order = require('./routes/orderRoute');
app.use('/api/v1',order);

const payment = require('./routes/paymentRoute');
app.use('/api/v1',payment);



//middleware for error 
const errorMiddleware = require('./middleware/error');
app.use(errorMiddleware);


module.exports = app ;