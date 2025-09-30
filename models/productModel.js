const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    productName:{
        type:String,

    },price:{
        type:Number
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

const productModel = mongoose.model("products",productSchema)
module.exports = productModel