const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    deliveryAddress:{
        type:String,
        
    },
    cart:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Carts"
    },
    orderHistory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Orders"
    }],
    isVerified:{
        type:Boolean,
        default:false
    },
    isOnline:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const userModel = mongoose.model("users",userSchema)
module.exports = userModel