require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const DB = process.env.DB
const PORT = process.env.PORT
const userRouter = require('./routes/userRoute')
const productRouter = require('./routes/productRoute')
const cartRouter = require('./routes/cartRoute')
const orderRouter = require('./routes/orderRoutes')
const cors = require('cors') 

const app = express()

app.use(express.json())
app.use(cors({origin:"*"}))
app.use(userRouter)
app.use(productRouter)
app.use(cartRouter)
app.use('/orders', orderRouter)
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

