const router = require('express').Router()
const {signUp,verifyUser,signIn,forgotPassword,resetPassword, changePassword} = require('../controllers/UserController')

const {signUpValidator,signInValidator,forgotPasswordValidator,resetPasswordValidator,changePasswordValidator} = require('../middleware/validator')

// router.post('/signUp',signUpValidator,signUp)
router.post('/signUp',signUp)
router.post('/verify/:token',verifyUser)
router.post('/signIn',signInValidator,signIn)
router.post('/forgot',forgotPasswordValidator,forgotPassword)
router.post('/reset/:token',resetPasswordValidator,resetPassword)
router.post('/change/:id',changePasswordValidator,changePassword)



module.exports = router 




