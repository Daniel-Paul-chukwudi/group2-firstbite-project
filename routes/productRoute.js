const {addProduct, getAProduct, getAllProduct, getCategories} = require('../controllers/productConroller')
const express = require('express')
const router = express.Router()
const uploads = require('../middleware/multer')

router.get('/product/categories',getCategories)
router.post('/product',uploads.array('productImages',5),addProduct)
router.get('/product/:id',getAProduct)
router.get('/product',getAllProduct)


module.exports = router

