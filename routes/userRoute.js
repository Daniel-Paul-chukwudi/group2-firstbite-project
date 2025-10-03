const {signUp,verifyUser,signIn,forgotPassword,resetPassword, changePassword, getOne, getAll} = require('../controllers/UserController')
const express = require('express')
const router = express.Router()
const {signUpValidator,signInValidator,forgotPasswordValidator,resetPasswordValidator,changePasswordValidator} = require('../middleware/validator')

// router.post('/signUp',signUpValidator,signUp)
router.post('/signUp',signUp)
router.post('/verify/:token',verifyUser)
router.post('/signIn',signInValidator,signIn)
router.post('/forgot',forgotPasswordValidator,forgotPassword)
router.post('/reset/:token',resetPasswordValidator,resetPassword)
router.post('/change/:id',changePasswordValidator,changePassword)

router.get('/user/:id',getOne)
router.get('/user',getAll)


module.exports = router




