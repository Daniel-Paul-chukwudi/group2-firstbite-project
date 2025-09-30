require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const DB = process.env.DB
const PORT = process.env.PORT
const userRouter = require('./routes/userRoute')

const app = express()

app.use(express.json())
app.use(userRouter)


mongoose.connect(DB).then(()=>{
    console.log("Database connected successfully");
    app.listen(PORT,()=>{
        console.log(`Server is running on PORT: ${PORT} yeahhhh boiiiiii`);
        
    })
    
    
}).catch((error)=>{
    console.log(error.message);
})

