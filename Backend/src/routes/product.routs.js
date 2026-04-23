import express from 'express'
import {authenticateSeller} from '../middleware/auth.middleware.js'
import { createProductController,getSellerProduct,getAllProducts,getProductDetail,addVarient,editVariant,deleteVariant } from '../controllers/product.controller.js'
import { upload } from '../middleware/upload.middleware.js'
import { createProductValidator } from '../validator/product.validator.js'



export const productRouter = express.Router()

productRouter.post('/',authenticateSeller,upload.array('images',7),createProductValidator,createProductController)
productRouter.get('/seller',authenticateSeller,getSellerProduct)

productRouter.get('/',getAllProducts)
productRouter.get('/:productId',getProductDetail)
productRouter.post('/:productId/varient',authenticateSeller,upload.array('images',7),addVarient)
productRouter.put('/:productId/varient/:variantId',authenticateSeller,upload.array('images',7),editVariant)
productRouter.delete('/:productId/varient/:variantId',authenticateSeller,deleteVariant)