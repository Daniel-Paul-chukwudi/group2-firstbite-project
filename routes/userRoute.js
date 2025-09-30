const {signUp,verifyUser,signIn,forgotPassword,resetPassword, changePassword} = require('../controllers/UserController')
const express = require('express')
const router = express.Router()

router.post('/signUp',signUp)
router.post('/verify/:token',verifyUser)
router.post('/signIn',signIn)
router.post('/forgot',forgotPassword)
router.post('/reset/:token',resetPassword)
router.post('/change/:id',changePassword)



module.exports = router




