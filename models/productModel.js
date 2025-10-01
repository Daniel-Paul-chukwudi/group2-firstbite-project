const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    productName:{
        type:String,
        required:true

    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    productImages:[{
        imageUrl:{
            type:String,
        },
        publicId:{
            type:String,
        }
    }]
})

const productModel = mongoose.model("products",productSchema)
module.exports = productModel