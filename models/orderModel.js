const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    productId:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }],
    date:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['confirmed','on route','delivered'],
        default:'confirmed'
    }
},{timestamps:true})

const orderModel = mongoose.model('orders',orderSchema)

module.exports = orderModel