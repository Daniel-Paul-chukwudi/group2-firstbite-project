const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    productName:{
        type:String,

    },price:{
        type:Number
    },
    email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
},
    category:{
        type:String
    },
    description:{
        type:String
    },
    productImages:[{
        imageUrl:{
            type:String,
            required:true
        },
        publicId:{
            type:String,
            required:true
        }
    }]
})

const productModel = mongoose.model("productss",productSchema)
module.exports = productModel