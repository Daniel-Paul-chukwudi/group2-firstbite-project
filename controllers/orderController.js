const orderModel = require('../models/orderModel');
const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');
const userModel = require('../models/userModel');

exports.createOrder = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ 
                message: "User ID is required for order creation." 
            });
        }

    // Directly populate the product details from the user's cart
        const cart = await cartModel.findOne({ userId }).populate('goods.productId');
        
        if (!cart || cart.goods.length === 0) {
            return res.status(400).json({ 
                message: "Cannot create order, cart is empty." 
            });
        }

        const orderGoods = cart.goods.map(item => {
            const product = item.productId;
            
            if (!product) {
                 throw new Error("Missing product details for the item you added to cart.");
            }
            
            return {
                productId: product._id,
                productName: product.productName,
                price: product.price,
                quantity: item.quantity, 
                productImage: product.productImages && Array.isArray(product.productImages) && product.productImages.length > 0 ? product.productImages [0] : null,
            };
        });

        const newOrder = new orderModel({
            userId: userId,
            goods: orderGoods, 
            totalAmount: cart.totalPrice,
        });
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, 
            { $push: { orderHistory: newOrder._id } }
        );
        
        cart.goods = [];
        cart.totalPrice = 0;
        await cart.save();
        
        res.status(201).json({
            message: "Your order has been placed successfully.",
            data: newOrder
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find();
        res.status(200).json({
            message: "Find all orders below",
            data: orders
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get one order
exports.getOneOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        const order = await orderModel.findById(orderId)
        
        if (!order) {
            return res.status(404).json({
                message: 'Order not found',
                data: order
            })
        };

res.status(200).json({
    message: 'Find order below',
    data: order
});

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
};

// Get all orders for a specific user

exports.getOrdersByUser = async (req, res)=>{
try {
    const userId = req.params.userId
    const orders = await orderModel.find({ userId })

    if(!orders || orders.length === 0) {
        return res.status(404).json({
            message: 'No order found for this user',
        })
    }

    res.status(200).json({
        message: 'Find all orders for this user below',
        data: orders,
    })

} catch (error) {
    res.status(500).json({
        message: 'Internal server error',
        error: error.message
    })
}
};