import productModel from '../models/product.model.js'
import userModel from '../models/user.model.js'
import { imagekit } from '../utils/imagekit.js'


export async function createProductController(req, res) {

    try {


        const seller = req.user
        const { title, description, priceAmount, images } = req.body
        if (req.files) {
            const images = await Promise.all(req.files.map(async (file) => {
                const uploadImage = await imagekit.upload({
                    file: file.buffer,
                    fileName: Date.now() + "-" + file.originalname,
                    folder: "snitch/products"
                })
                return uploadImage
            }))
            const product = await productModel.create({
                title,
                description,
                price: priceAmount,
                images: images,
                seller: seller._id
            })
            return res.status(201).json({
                message: "Product created successfully",
                product
            })
        }



    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }


}
export async function getSellerProduct(req, res) {
    try {
        const seller = req.user

        const products = await productModel.find({ seller: seller._id })
        return res.status(200).json({
            message: "Products fetched successfully",
            products
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export async function addVarient(req, res) {
    try {
        const productId = req.params.productId
        const { price, stock } = req.body
        const attributes = new Map()
if (req.body['attributes[color]']) attributes.set('color', req.body['attributes[color]'])
if (req.body['attributes[size]']) attributes.set('size', req.body['attributes[size]'])

        const product = await productModel.findById(productId)
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Unauthorized"
            })
        }

        const newVarient = {
            price,
            stock,
         attributes
        }

        if (req.files) {
            const images = await Promise.all(req.files.map(async (file) => {
                const uploadImage = await imagekit.upload({
                    file: file.buffer,
                    fileName: Date.now() + "-" + file.originalname,
                    folder: "snitch/variants"
                })
                return uploadImage
            }
            ))
            newVarient.images = images


        }
        product.varient.push(newVarient)
        await product.save()
        res.status(201).json({
            message: "Varient added successfully",
            product
        })

    }
    catch (err) {

        return res.status(500).json({ message: err.message })
    }
}

export async function editVariant(req, res) {
    try {
        const { productId, variantId } = req.params
        const { price, stock, attributes } = req.body
        const product = await productModel.findById(productId)
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
      }
      if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Unauthorized"
            })
            const variant = product.varient.id(variantId)
            if (!variant) {
                return res.status(404).json({
                    message: "Variant not found"
                })
            }
            if (price) variant.price = price
            if (stock) variant.stock = stock
            if (attributes) variant.attributes = attributes

            if (req.files) {
                const images = await Promise.all(req.files.map(async (file) => {
                    const uploadImage = await imagekit.upload({
                        file: file.buffer,
                        fileName: Date.now() + "-" + file.originalname,
                        folder: "snitch/variants"
                    })
                    return uploadImage
                }))

                variant.images = images
      
            }
            await product.save()
            return res.status(200).json({
                message: "Variant updated successfully",
                product
            })
      

        }
    }

        catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

export async function deleteVariant(req, res) {
    try {
        const { productId, variantId } = req.params
        const product = await productModel.findById(productId)
        if (!product) {
            return res.status(404).json({   
                message: "Product not found" 
            })

        }
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Unauthorized"
            })
        }
        const variant = product.varient.id(variantId)
        if (!variant) {
            return res.status(404).json({
                message: "Variant not found"
            })
        }
        product.varient.remove(variantId)
        await product.save()
        return res.status(200).json({
            message: "Variant deleted successfully",
            product
        })

    }    catch (err) {
        return res.status(500).json({ message: err.message })
    }   
}

export async function getAllProducts(req, res) {
    try {
        const products = await productModel.find()
        return res.status(200).json({
            message: "Products fetched successfully",
            products
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}



export async function getProductDetail(req, res) {
    try {
        const productId = req.params.productId
        const product = await productModel.findById(productId)
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }
        return res.status(200).json({
            message: "Product fetched successfully",
            product
        })

    }
    catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}