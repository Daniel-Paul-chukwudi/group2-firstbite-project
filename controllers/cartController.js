const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');
const userModel = require('../models/userModel');

exports.addCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({
                 message: 'userId and productId are required'
                 });
        }

        let cart = await cartModel.findOne({ userId });

        if (!cart) {
            cart = new cartModel({
                userId: userId,
                goods: [{ productId, quantity: quantity || 1 }]
            });
        } else {
            let found = false;
            for (let item of cart.goods) {
                if (item.productId.toString() === productId) {
                    item.quantity += quantity || 1;
                    found = true;
                    break;
                }
            }
            if (!found) {
                cart.goods.push({ productId: productId, quantity: quantity || 1 });
            }
        }

        let total = 0;
        for (const item of cart.goods) {
            const product = await productModel.findById(item.productId);
            if (product && typeof product.price === 'number') {
                total += product.price * item.quantity;
            }
        }
        cart.totalPrice = total;
         await cart.save();

        const user = await userModel.findById(userId)
        userCart = user.cart
        userCart.push(cart._id)
        await userModel.findByIdAndUpdate(userId,{cart: userCart})
        await cart.populate('goods.productId', 'productName price');

        res.status(200).json({
            message: 'Cart added successfully',
            cart
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};


exports.getCart = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({
                 message: 'userId is required'
                 });
        }
        const cart = await cartModel.findOne({ userId }).populate('goods.productId');
        if (!cart) {
            return res.status(404).json({
                 message: 'Cart not found'
                 });
        }
        res.status(200).json({
            message: 'Cart fetched successfully',
            cart
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};


exports.updateCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        if (!userId || !productId || typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({
                 message: 'userId, productId and quantity are required'
                 });
        }
        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ 
                message: 'Cart not found'
             });
        }

        let found = false;
        for (let i = 0; i < cart.goods.length; i++) {

            if (cart.goods[i].productId.toString() === productId) {

                cart.goods[i].quantity = quantity;
                found = true;
                break;
            }
        }
        if (!found) {
            return res.status(404).json({
                 message: 'Product not found in cart'
                 });
        }

        let total = 0;
        for (const goods of cart.goods) {
            const product = await productModel.findById(goods.productId);
            if (product && typeof product.price === 'number') {
                total += product.price * goods.quantity;
            }
        }
        cart.totalPrice = total;

        await cart.save();
        await cart.populate('goods.productId', 'productName price');
        res.status(200).json({
            message: 'Cart item updated successfully',
            cart
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};


exports.deleteAProduct = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        if (!userId || !productId) {
            return res.status(400).json({
                 message: 'userId and productId are required'
                 });
        }
        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                 message: 'Cart not found'
                 });
        }
        let found = false;
        for (let i = 0; i < cart.goods.length; i++) {
            if (cart.goods[i].productId.toString() === productId) {
                cart.goods.splice(i, 1);
                found = true;
                break;
            }
        }
        if (!found) {
            return res.status(404).json({
                 message: 'Product not found in cart'
                 });
        }

        let total = 0;
        for (const item of cart.goods) {
            const product = await productModel.findById(item.productId);
            if (product && typeof product.price === 'number') {
                total += product.price * item.quantity;
            }
        }
        cart.totalPrice = total;

        await cart.save();
        await cart.populate('goods.productId', 'productName price');
        res.status(200).json({
            message: 'Product removed from cart successfully',
            cart
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};



exports.clearCart = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ 
                message: 'userId is required' 
            });
        }
        const cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ 
                message: 'Cart not found'
             });
        }
        cart.goods = [];
        cart.totalPrice = 0;
        await cart.save();
        res.status(200).json({
            message: 'Cart cleared successfully',
            cart
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};