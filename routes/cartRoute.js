const router = require('express').Router()
const { addCart, getCart, updateCart, deleteAProduct } = require('../controllers/cartController');

router.post('/cart', addCart); 
router.get('/getC', getCart);
router.put('/updateC', updateCart)
router.delete('/removeC', deleteAProduct)

module.exports = router