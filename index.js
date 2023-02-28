const app= require('./app');
const port = 4000 ;

// dotenv for enviroment
const dotenv = require('dotenv');
dotenv.config({path:'Backend/config/config.env'});


app.listen(port,(err)=>{
    if(err){
        return console.log(`Server is up and running on port ${port}`);
    }
    console.log(`Server is up and running on port ${port}`);

});