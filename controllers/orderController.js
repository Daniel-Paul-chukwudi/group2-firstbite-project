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

exports.reOrder = async (req, res) => {
    try {
        const { userId } = req.body;
        const { orderId } = req.params;

        if (!userId || !orderId) {
            return res.status(400).json({
                message: 'User id and order id are required for reorder'
            });

        } const oldOrder = await orderModel.findById(orderId)
        if (!oldOrder) {
            return res.status(404).json({
                message: "Initial order not found"
            });
        }
        if (oldOrder.userId.toString() !== userId) {
            return res.status(403).json({
                message: 'Access denied, you can only reorder your own purchases'
            });
        }
        const itemsToReorder = (oldOrder.goods && oldOrder.goods.length > 0) ? oldOrder.goods : oldOrder.meal || [];

        if (itemsToReorder.length === 0) {
            return res.status(400).json({
                message: "This order contains no items to re-order."
            });
        }

        let cart = await cartModel.findOne({ userId });
        if (!cart) {
            cart = new cartModel({ userId: userId, goods: [], totalPrice: 0 });
        }
        let cartTotal = cart.totalPrice;

        for (const orderItem of itemsToReorder) {
            const productIdString = orderItem.productId.toString();
            let itemFound = false;

            if (!orderItem.productId || !orderItem.price || !orderItem.quantity) continue;

            for (let cartItem of cart.goods) {
                if (cartItem.productId.toString() === productIdString) {
                    cartItem.quantity += orderItem.quantity;
                    itemFound = true;
                    break;
                }
            }

            if (!itemFound) {
                cart.goods.push({
                    productId: orderItem.productId,
                    quantity: orderItem.quantity
                });
            }

            cartTotal += orderItem.price * orderItem.quantity;
        }

        cart.totalPrice = cartTotal;
        await cart.save();

         await cart.populate('goods.productId'); 

        res.status(200).json({
            message: `Reorder is successful, items from order ${oldOrder.orderNumber} added to your cart.`,
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// Order rating
exports.orderRating = async (req, res) => {
    try {
        const { userId, rating } = req.body; 
        const { orderId } = req.params;

        if (!userId || !orderId || typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({ 
                message: 'A valid userId, orderId, and a rating (1-5) are required'
            });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ 
                message: 'Order not found' 
            });
        }
        
        if (order.userId.toString() !== userId) {
            return res.status(403).json({ 
                message: 'Access denied, you can only rate your own orders'
                 });
        }
        
        if (order.rating) {
             return res.status(400).json({
                 message: `This order has already been rated ${order.rating} stars.` });
        }

        order.rating = rating;
        await order.save(); 

        res.status(200).json({
            message: `Order ${order.orderNumber} rated successfully with ${rating} stars.`,
            data: { 
                orderId: order._id,
                rating: order.rating 
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};


exports.orderSummary = async (req, res) => {
    try {
        const orderId = req.params.orderId
        const order = await orderModel.findById(orderId).populate('goods.productId')
        const user = await userModel.findById(order.userId)

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            })
        };

        res.status(200).json({
            message: 'Find the order summary below',
            data: order,
            userAddress: user.deliveryAddress,
            phoneNumber: user.phoneNumber
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        })
    }
};