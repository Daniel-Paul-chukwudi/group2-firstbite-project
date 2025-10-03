const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    goods: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        productName: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        productImage: {
            imageUrl: { type: String },
            publicId: { type: String }
        }
    }
    ],
    orderNumber: {
        type: String,
        unique: true
    },
    timeOfOrder: {
        type: Date,
        default: Date.now
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ["confirmed", "on-its-way", "delivered"],
        default: "confirmed"
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    }
});

// To generate order numbers 

orderSchema.pre("save", function (next) {
    if (!this.orderNumber) {
        const randomSix = Math.floor(100000 + Math.random() * 900000); // ensures 6 digits
        this.orderNumber = `ORD-${randomSix}`;
    }
    next();
});

const orderModel = mongoose.model("order", orderSchema)
module.exports = orderModel