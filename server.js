require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const DB = process.env.DB
const PORT = process.env.PORT
const userRouter = require('./routes/userRoute')
const productRouter = require('./routes/productRoute')
const cartRouter = require('./routes/cartRoute')
const orderRouter = require('./routes/orderRoutes')
const cors = require('cors') 
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi  = require('swagger-ui-express')

const app = express()

app.use(express.json())
app.use(cors({origin:"*"}))
app.use(userRouter)
app.use(productRouter)
app.use(cartRouter)
app.use(orderRouter)

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Api documentation for mini project',
    version: '4.1.9',
    description:
      'first swagger documentation class',
    // license: {
    //   name: 'Licensed Under MIT',
    //   url: 'https://spdx.org/licenses/MIT.html',//whatever
    // },
    contact: {
      name: 'JSONPlaceholder',
      url: 'https://google.com',//frontend link
    },
  },
  servers: [
    {
      url: 'https://group2-firstbite-project.onrender.com',
      description: 'production server',
    },
    {
      url: 'http://localhost:4209',
      description: 'Development server',
    }
  ],
  components:{
    securitySchemes:{
      bearerAuth:{
        type:"http",
        scheme:"bearer",
        bearerFormat:"JWT",// optional but recomended
        description:"Enter your jwt token in the format **Bearer &lt;token&gt;**",
      }
    }
  },
  security:[
    {
      bearerAuth:[],
    }
  ]
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

mongoose.connect(DB).then(()=>{
    console.log("Database connected successfully");
    app.listen(PORT,()=>{
        console.log(`Server is running on PORT: ${PORT} yeahhhh boiiiiii`);  
    })
}).catch((error)=>{
    console.log(error.message);
})

