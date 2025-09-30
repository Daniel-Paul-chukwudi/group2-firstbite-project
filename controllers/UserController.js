const { json } = require('express')
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require("dotenv").config()
const secret = process.env.jwt_secret

exports.signUp = async (req,res)=>{
    try {
        const {fullName,email,password,phoneNumber,confrimPassword,deliveryAddress} = req.body

        const Echeck = await userModel.findOne({email:email.toLowerCase()})
        const Pcheck = await userModel.findOne({phoneNumber:phoneNumber})
        
        if(Echeck){
            return res.status(400).json({
                message:"email is already in use"
            })
        }
        if(Pcheck){
            return res.status(400).json({
                message:"phonenumber is already in use"
            })
        }
        if(password !== confrimPassword){
            return res.status(400).json({
                message:"passwords do not match"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)

        
        
        const user = new userModel({
            fullName,
            email,
            password:hashPassword,
            phoneNumber,
            deliveryAddress
        })
        
        // await user.save()

        const token = await jwt.sign({id:user._id},secret,{expiresIn:"5m"})


        res.status(201).json({
            message:"User created successfully",
            data: user
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
        const {email,password,phoneNumber} = req.body

        if (!email && !phoneNumber){
            return res.status(400),json({
                message:"Please enter either your email or phone number"
            })
        }

        const Echeck =  await userModel.findOne({email:email.toLowerCase()})
        const Pcheck =  await userModel.findOne({phoneNumber:phoneNumber})
        if(!Echeck || !Pcheck){
            return res.status(404).json({
                message:"user not found"
            })
        }



    } catch (error) {
        res.status(500).json({
        message:"Internal server error",
        error:error.message
      })  
    }
}