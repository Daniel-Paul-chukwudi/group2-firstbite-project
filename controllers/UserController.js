const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require("dotenv").config()
const secret = process.env.jwt_secret
const user = process.env.user
const Euser = process.env.Euser
const {sendMail} = require('../middleware/email')
const {verify,forgotPassword} = require('../middleware/emailTemplates')
const sendEmail = require('../middleware/Bmail')

exports.signUp = async (req,res)=>{
    try {
        const {fullName,email,password,phoneNumber,confirmPassword,deliveryAddress} = req.body
        
        const Echeck = await userModel.findOne({email:email.toLowerCase()})
        const Pcheck = await userModel.findOne({phoneNumber:phoneNumber})
        
        if(Echeck){
            return res.status(400).json({
                message:"email is already in use"
            })
        }else if(Pcheck){
            return res.status(400).json({
                message:"phonenumber is already in use"
            })
        }else if(password !== confirmPassword){
            return res.status(400).json({
                message:"passwords do not match"
            })
        }else{
                const salt = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(password,salt)
                const otp = Math.round(Math.random() * 1e4).toString().padStart(4, "0")

        
        
        const user = new userModel({
            fullName,
            email,
            password:hashPassword,
            phoneNumber,
            deliveryAddress,
            otp,
            otpExpiredAt: Date.now() + 1000 * 300
        })
        
        await user.save()

        
        
        const token = await jwt.sign({id:user._id},secret,{expiresIn:"5m"})
        const subject = `Hello ${fullName} kindly verify your email`
        // const link = `${req.protocol}://${req.get("host")}/verify/${token}`
        
        
        
        const  msg={
            email:email,
            subject:subject,
            html:verify(user.fullName,otp)
        }
        await sendEmail(msg)

        res.status(201).json({
            message:"User created successfully",
            data: user,token
        })

        }


        
    } catch (error) {
      res.status(500).json({
        message:"Internal server error",
        error:error.message
      })  
    }
}

exports.verifyUser = async(req,res)=>{
    try {
        const token = req.params.token
        const {otp} = req.body

        jwt.verify(token,secret,async (error,result)=>{
            console.log(result);
            
            if(error){
                res.status(400).json({
                    message:"Email Expired"
                })
            }else{
                const user = await userModel.findById(result.id)
                if (Date.now() > user.otpExpiredAt) {
                        return res.status(400).json({
                            message: 'OTP expired'
                        })
                }
                }
                if (otp !== user.otp) {
                        return res.status(400).json({
                            message: 'Invalid otp'
                        })
                }else{
                    await userModel.findByIdAndUpdate(result.id,{isVerified:true,otp:null,otpExpiredAt:null})
                    res.status(200).json({
                        message:"Email verification successful"
                    })
            }
        })

    } catch (error) {
        res.status(500).json({
        message:"Internal server error",
        error:error.message
      })
    }
}

exports.signIn = async (req,res)=>{
    try {
        const {email,password} = req.body
        if (!email){
            return res.status(400).json({
                message:"Please enter your email"
            })
        }
        const Echeck =  await userModel.findOne({email:email.toLowerCase()})
        if(!Echeck){
            return res.status(404).json({
                message:"invalid login credentials"
            })
        }
        const checkPassword = await bcrypt.compare(password,Echeck.password)
        if(!checkPassword){
            return res.status(400).json("invalid login credentials")
        }
        if(Echeck.isVerified === false){
            return res.status(403).json({
                message:"Kindly verify your email to continue"
            })
        }
        await userModel.findByIdAndUpdate(Echeck._id,{isOnline:true})
        res.status(200).json({
            message:`Welcome ${Echeck.fullName} we are happy to see you`,

        })
    } catch (error) {
        res.status(500).json({
        message:"Internal server error",
        error:error.message
      })  
    }
}
exports.forgotPassword = async (req,res)=>{
    try {
        const {email} = req.body

    const Echeck = await userModel.findOne({email:email.toLowerCase().trim()})//check if the email exists
    
    

    if(!Echeck){//email checker
        return res.status(400).json("email does not exist")
    }


    const subject = "password reset verification"//subject of the email
    const token = jwt.sign({id:Echeck._id},secret,{expiresIn:"5m"})//token generation
    // Echeck.token = token//assigning the value of the token to the user token key

    const link = `${req.protocol}://${req.get("host")}/reset/${token}`//building the link in the mail


    await sendMail({//making use of the send mail function to send the mail to the user
            to:email,
            subject,
            html:forgotPassword(link,Echeck.fullName)//the html file that will be displayed in the mail
            
           
        }).then(()=>{console.log("mail sent");//successful mail check
        }).catch((e)=>{//error checker and catcher
            console.log(e.message);
            
        })
    res.status(200).json("check your email for further instructions")//rsponse message
    } catch (error) {//error checker and catcher
        res.status(500).json({
            message:"internal server error",
            error:error.message
        })
    }
}

exports.resetPassword  = async (req,res)=>{
    try {
        const {newPassword,confirmPassword} = req.body
        const token = req.params.token
        if(newPassword !== confirmPassword){//check if the both passwords match
            return res.status(400).json({
                message:"passwords do not match"
            })
        }
        const salt = await bcrypt.genSalt(10)//salt generation for encryption
        const hashpassword = await bcrypt.hash(newPassword,salt)//password encryption

        
        jwt.verify(token,secret,async(error,result)=>{//check and verify the user token
            if(error){
                // console.log(error);
                 res.status(400).json({
                    message:"Email expired"
                })
                
            }else{
                await userModel.findByIdAndUpdate(result.id,{password:hashpassword},{new:true})
                // console.log(result);
                
                res.status(200).json({//response
                    message:"password successfully changed"
                })
            }
        })
        
    } catch (error) {//error checker and catcher
        res.status(500).json({
            message:"internal server error",
            error:error.message
        })
    }
}
exports.changePassword = async (req,res)=>{
    try {
        const {password,newPassword,confirmPassword} = req.body
        const id = req.params.id
        
        const user = await userModel.findById(id)
        if(!user){
            return res.status(404).json({
                message:"user not found"
            })
        }
        const checkPassword = await bcrypt.compare(password,user.password)

        if(!checkPassword){
            return res.status(404).json({
                message:"Invalid current password"
            })
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({
                message:"Passwords do not match"
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(confirmPassword,salt)

        await userModel.findByIdAndUpdate(id,{password:hashpassword},{new:true})
        res.status(200).json({
            message:"Password changed successfully"
        })

    } catch (error) {
        res.status(500).json({
            message:"internal server error",
            error:error.message
        })
    }
}

exports.getOne = async (req,res)=>{
    try {
        const userId = req.params.id
        if(!userId){
            return res.status(400).json({
                message:"userId required"
            })
        }

        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }

        res.status(200).json({
            message:"user found",
            data:user
        })

    } catch (error) {
        res.status(500).json({
            message:"internal server error",
            error:error.message
        })
    }
}

exports.getAll = async (req,res)=>{
    try {
        
        const user = await userModel.find()
        if(user.length < 1){
            return res.status(200).json({
                message:"Database empty",
                data: user
            })
        }

        res.status(200).json({
            message:"All users in DB",
            data:user
        })

    } catch (error) {
        res.status(500).json({
            message:"internal server error",
            error:error.message
        })
    }
}

exports.updateUser = async(req,res)=>{
    try {
        
        const id = req.params.id

        const user = await userModel.findById(id)


        const update = req.body

        const newData = await userModel.findByIdAndUpdate(id,update,{new:true})


        res.status(200).json({
            message:"updated successfully",
            data:newData
        })

    } catch (error) {
        res.status(500).json({
            message:"Internal server error",
            error:error.message
        })
    }
}