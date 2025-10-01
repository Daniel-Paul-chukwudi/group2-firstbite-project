const {addProduct, getAProduct,getAllProduct, getCategories} = require('../controllers/productConroller')
const express = require('express')
const router = express()
const uploads = require('../middleware/multer')

router.post('/product',uploads.array('productImages',5),addProduct)
// router.get('/product/:id',getAProduct)
router.get('/product',getAllProduct)
router.get('/product/categories',getCategories)


module.exports = router

