const router = require('express').Router()
const { addCart, getCart, updateCart, deleteAProduct, clearCart } = require('../controllers/cartController');

router.post('/cart', addCart); 
router.get('/cart/:userId', getCart);
router.put('/cart/:userId/:productId/', updateCart)
router.delete('/cart/:userId/:productId', deleteAProduct)
router.delete('/clear/:userId', clearCart)


module.exports = router