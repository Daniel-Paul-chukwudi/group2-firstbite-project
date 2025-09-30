const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    fullName:{
        type:String,

    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    phoneNumber:{
        type:Number
    },
    isVerified:{
        type:Boolean
    },
    token:{
        type:String
    }
})

const userModel = mongoose.model("users",userSchema)
module.exports = userModel