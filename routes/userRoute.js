const {signUp} = require('../controllers/UserController')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const productController = require('../controllers/productController')
const upload = multer({storage:storage})


router.post('/signUp',signUp)

router.post("/add",
  upload.array("productImages", 5), // allow up to 5 images
  productController.addProduct
);

router.get("/:id", productController.getAProduct);

router.put( "/update/:id", upload.array("productImages", 5),
  productController.updateAProduct
);

router.delete("/delete/:id", productController.deleteAProduct);


module.exports = router




