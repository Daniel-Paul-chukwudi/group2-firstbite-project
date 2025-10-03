const mongoose = require("mongoose")
const productModel = require("../models/productModel")
const cloudinary = require('../config/cloudinary')
const fs = require('fs')


exports.addProduct = async (req,res)=>{
    try {
        const {productName,price,category,description} = req.body
    const files = req.files
    let response
    let parentList = []
    let List = {}

        if(files && files.length > 0){
            for (const file of files ) {
                // console.log("the files",file);
                
                response = await cloudinary.uploader.upload(file.path)
                babyList = {
                    publicId: response.public_id,
                    imageUrl: response.secure_url
                }
                parentList.push(List)
                // console.log(list);
                
                fs.unlinkSync(file.path)
            }
        }

        const product = new productModel({
            productName,
            price,
            category,
            description,
            productImages:parentList

        })
        await product.save()
        res.status(201).json({
            message:"product created successfully",
            data:product
        })
    } catch (error) {
        res.status(201).json({
            message:"Internal Server Error",
            error:error.message
        }) 
    }
}

exports.getAllProduct = async (req,res)=>{
        try {
            const products = await productModel.find()
            res.status(200).json({
                message:"Products fetched successfully",
                total:products.length,
                data:products
            })
        } catch (error) {
            res.status(500).json({
                message:"Internal Server Error",
                error:error.message
            })
        }
    }

exports.getAProduct = async (req,res)=>{
        try {
            const id = req.params.id
            const product = await productModel.findById(id)
            if(!product){
                return res.status(404).json({
                    message:"Product not found"
                })
            }
            res.status(200).json({
                message:"Product fetched successfully",
                data:product
            })
        } catch (error) {
            res.status(500).json({
                message:"Internal Server Error",
                error:error.message
            })
        }
    }

exports.getCategories= async (req,res)=>{
    try {
        const products = await productModel.find()
        
        
        var categories = []
        
        let holder = []
        products.forEach(x => {
            holder.push(x.category)
        });
      
        
        categories = holder.filter((value, index, self) => self.indexOf(value) === index);
        
        
        res.status(200).json({
            message:"All the available categories",
            data:categories
        
        })

    } catch (error) {
        res.status(500).json({
                message:"Internal Server Error l",
                error:error.message
            })
    }
}
exports.updateAProduct = async (req,res)=>{
        try {
            const id = req.params.id
            const {productName,price,category,description} = req.body
            const files = req.files
            let response
            let parentList = []
            let list = {}
            const product = await productModel.findById(id)
            if(!product){
                return res.status(404).json({
                    message:"Product not found"
                })
            }
            if(files && files.length > 0){
                for (const pd of product.productImages){
                    await cloudinary.uploader.destroy(pd.publicId)
                    fs.unlinkSync(files.path)
                    }
                for (const file of files){
                    response = await cloudinary.uploader.upload(file.path)
                    babyList = {
                    publicId: response.public_id,
                    imageUrl: response.secure_url,
                    };
                    parentList.push(list);
                    fs.unlinkSync(file.path)
                    }
            }else{
                const updatedProduct = await productModel.findByIdAndUpdate(id,{
                    productName: productName ?? product.productName,
                    price:price ?? product.price,
                    category:category ?? product.category,
                    description: description ?? product.description,
                    productImages:parentList
                },{new:true})
                
                res.status(200).json({
                    message:"Product updated successfully",
                    data:updatedProduct
                })
            }
        } catch (error) {
            res.status(500).json({
                message:"Internal Server Error",
                error:error.message
            })
        }
    }   
    
exports.deleteAProduct = async (req,res)=>{
        try {
            const id = req.params.id
            const product = await productModel.findById(id)
            if(!product){
                return res.status(404).json({
                    message:"Product not found"
                })
            }
            await productModel.findByIdAndDelete(id)
            res.status(200).json({
                message:"Product deleted successfully",
                data:product
            })
        } catch (error) {
            res.status(500).json({
                message:"Internal Server Error",
                error:error.message
            })
        }
    }
   
exports.getOneCategory = async ()=>{
    try {
        
    } catch (error) {
        res.status(500).json({
                message:"Internal Server Error",
                error:error.message
            })
    }
}