const router = require('express').Router()
const {addProduct} = require('../controllers/productConroller')

router.post('/add', addProduct)

module.exports = router

