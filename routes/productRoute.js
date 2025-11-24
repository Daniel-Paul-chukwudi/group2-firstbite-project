const {addProduct, getAProduct, getAllProduct, getCategories, getOneCategory} = require('../controllers/productConroller')
const express = require('express')
const router = express.Router()
const uploads = require('../middleware/multer')

/**
 * @swagger
 * /product/categories:
 *   get:
 *     summary: Get all product categories
 *     description: Fetches a list of all unique product categories from the database.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Successfully fetched product categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All the available categories"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Electronics"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 *                   example: "MongoError: something went wrong"
 */
router.get('/product/categories',getCategories)

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Add a new product
 *     description: Allows uploading a new product with multiple images (up to 5) and details such as name, price, category, and description.
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *                 example: "iPhone 14"
 *               price:
 *                 type: number
 *                 example: 1200
 *               category:
 *                 type: string
 *                 example: "Electronics"
 *               description:
 *                 type: string
 *                 example: "Latest Apple iPhone model with improved camera."
 *               productImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: "Upload up to 5 images for the product"
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "product created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     productName:
 *                       type: string
 *                     price:
 *                       type: number
 *                     category:
 *                       type: string
 *                     description:
 *                       type: string
 *                     productImages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           publicId:
 *                             type: string
 *                           imageUrl:
 *                             type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 *                   example: "Error message here"
 */
router.post('/product',uploads.array('productImages',5),addProduct)

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     description: Fetches details of a product using its unique ID.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the product
 *     responses:
 *       200:
 *         description: Product fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     productName:
 *                       type: string
 *                     price:
 *                       type: number
 *                     category:
 *                       type: string
 *                     description:
 *                       type: string
 *                     productImages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           publicId:
 *                             type: string
 *                           imageUrl:
 *                             type: string
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 *                   example: "Error message here"
 */
router.get('/product/:id',getAProduct)

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get all products
 *     description: Fetches a list of all products available in the database.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Products fetched successfully"
 *                 total:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       productName:
 *                         type: string
 *                       price:
 *                         type: number
 *                       category:
 *                         type: string
 *                       description:
 *                         type: string
 *                       productImages:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             publicId:
 *                               type: string
 *                             imageUrl:
 *                               type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 *                   example: "Error message here"
 */
router.get('/product',getAllProduct)

/**
 * @swagger
 * /productC:
 *   get:
 *     summary: Get products by category
 *     description: Fetches all products that belong to a specific category.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: The category name to filter products
 *     responses:
 *       200:
 *         description: Items in this category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "items in this category"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       productName:
 *                         type: string
 *                       price:
 *                         type: number
 *                       category:
 *                         type: string
 *                       description:
 *                         type: string
 *                       productImages:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             publicId:
 *                               type: string
 *                             imageUrl:
 *                               type: string
 *       404:
 *         description: Invalid category or category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "invalid category or category not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 *                   example: "Error message here"
 */
router.get('/productC',getOneCategory)


module.exports = router

