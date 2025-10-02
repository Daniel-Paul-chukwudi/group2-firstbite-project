require('dotenv').config()
const secret = process.env.jwt_secret
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
exports.checkLogin = async (req,res,next)=>{
    try {
        const token  = req.headers.authorization
        if(!token){
            return res.status(401).json({
                message:"kindly login"
            })
        }
        const tk = token.split(" ")[1]
        const Tcheck = jwt.verify(tk,secret,async(error,result)=>{
            if(error){
                 res.status(401).json({
                    message:"login session expired, kindly login again"
                })
            }else{
               const user = await userModel.findById(result.id)
               req.user = user._id // assigning the id of the found user to the req.user variable
            }
            next()// this is to make sure the code moves on from the checklogin to the changePassword
        })
        
    } catch (error) {
        res.status(500).json({
            message:"internal server error",
            error:error.message
        })
    }
}