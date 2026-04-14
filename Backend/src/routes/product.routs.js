import express from 'express'
import {authVerification} from '../middleware/auth.middleware.js'
import { createProductController } from '../controllers/product.controller.js'
import { upload } from '../middleware/upload.middleware.js'
import { createProductValidator } from '../validator/product.validator.js'



export const productRouter = express.Router()

productRouter.post('/',authVerification,upload.array('images',7),createProductValidator,createProductController)

