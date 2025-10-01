require('dotenv').config()
const cloudinary = require('cloudinary').v2

 cloudinary.config({ 
        cloud_name: process.env.cloudName, 
        api_key: process.env.apiKey, 
        api_secret: process.env.apiSecret // Click 'View API Keys' above to copy your API secret
    });

module.exports = cloudinary