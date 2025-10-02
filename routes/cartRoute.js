const router = require('express').Router()
const { addCart, getCart, updateCart, deleteAProduct, clearCart } = require('../controllers/cartController');

router.post('/cart', addCart); 
router.get('/Cart', getCart);
router.put('/updateC', updateCart)
router.delete('/cart', deleteAProduct)
router.delete('/clear', clearCart)


module.exports = router