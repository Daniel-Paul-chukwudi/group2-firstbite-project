const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
   goods: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
            required: true
        },
        productImage:{
            type:String,
            
        },
        quantity: {
            type: Number,
            default: 1
        }
   }],
    totalPrice: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
 
});

const cartModel = mongoose.model('Carts', cartSchema);
module.exports = cartModel 