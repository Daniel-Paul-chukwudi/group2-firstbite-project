const {signUp} = require('../controllers/UserController')
const express = require('express')
const router = express.Router()

router.post('/signUp',signUp)


module.exports = router




