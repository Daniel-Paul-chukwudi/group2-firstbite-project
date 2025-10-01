require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const DB = process.env.DB
const PORT = process.env.PORT
const userRoute = require('./routes/userRoute')
const productRoute = require('./routes/productRoute')
const addCartRoute = require('./routes/cartRoute')
const app = express()

app.use(express.json())
app.use('/api/v1',userRoute)
app.use('/api/v1',productRoute)
app.use('/api/v1', addCartRoute)
// const date = new Date();
// console.log(date);
// console.log(date.toString().split(' '));


// console.log(typeof(date));



mongoose.connect(DB).then(()=>{
    console.log("Database connected successfully");
    app.listen(PORT,()=>{
        console.log(`Server is running on PORT: ${PORT} yeahhhh boiiiiii`);
        
    })
    
    
}).catch((error)=>{
    console.log(error.message);
}) 




