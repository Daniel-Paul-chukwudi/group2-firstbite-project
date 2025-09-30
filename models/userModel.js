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
        type:String
    },
    cart:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Cart"
    }],
    orderHistory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    }],
    isVerified:{
        type:Boolean,
        default:false
    }
})

const userModel = mongoose.model("users",userSchema)
module.exports = userModel