const { default: mongoose } = require("mongoose")
const productModel = require("../models/productModel")


exports.addProduct = async (req,res)=>{
    try {
        const {productName,price,category,description} = req.body
    const files = req.files
    let response
    let list = []
    let babyList = {}

        if(files && files.length > 0){
            for (const file of files ) {
                // console.log("the files",file);
                
                response = await cloudinary.uploader.upload(file.path)
                babyList = {
                    publicId: response.public_id,
                    imageUrl: response.secure_url
                }
                list.push(babyList)
                // console.log(list);
                
                fs.unlinkSync(file.path)
            }
        }

        const product = new productModel({
            productName,
            price,
            category,
            description,
            productImages:list

        })
        // await product.save()
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