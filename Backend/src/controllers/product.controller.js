import productModel from '../models/product.model.js'
import userModel from '../models/user.model.js'
import { imagekit } from '../utils/imagekit.js'

// ── Helper: upload files via imagekit ───────────────────────────
async function uploadFiles(files, folder) {
    return Promise.all(files.map(file =>
        imagekit.upload({
            file: file.buffer,
            fileName: Date.now() + '-' + file.originalname,
            folder
        })
    ))
}

// ── Helper: parse attributes from req.body ───────────────────────
// Handles attributes[color]=red, attributes[size]=XL etc.
function parseAttributes(body) {
    const attributes = new Map()
    for (const key of Object.keys(body)) {
        const match = key.match(/^attributes\[(.+)\]$/)
        if (match) {
            const attrKey = match[1].toLowerCase().trim()
            const attrVal = body[key].trim()
            if (attrKey && attrVal) attributes.set(attrKey, attrVal)
        }
    }
    return attributes
}

export async function createProductController(req, res) {
    try {
        const seller = req.user
        const { title, description, priceAmount } = req.body

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'At least one image is required' })
        }

        const images = await uploadFiles(req.files, 'snitch/products')

        const product = await productModel.create({
            title,
            description,
            price: priceAmount,
            images: images.map(img => ({ url: img.url, fileId: img.fileId })),
            seller: seller._id
        })

        return res.status(201).json({ message: 'Product created successfully', product })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export async function getSellerProduct(req, res) {
    try {
        const products = await productModel.find({ seller: req.user._id })
        return res.status(200).json({ message: 'Products fetched successfully', products })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export async function addVarient(req, res) {
    try {
        const { productId } = req.params

         console.log('BODY:', req.body)      // ye add karo
        console.log('FILES:', req.files)    // ye add karo
        // FormData se sab kuch string aata hai — explicitly Number mein convert karo
        const price = Number(req.body.price)
        const stock = Number(req.body.stock)

        if (!req.body.price || isNaN(price)) {
            return res.status(400).json({ message: 'Valid price is required' })
        }
        if (req.body.stock === undefined || req.body.stock === '' || isNaN(stock)) {
            return res.status(400).json({ message: 'Valid stock is required' })
        }

        const product = await productModel.findById(productId)
        if (!product) return res.status(404).json({ message: 'Product not found' })
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' })
        }

        const attributes = parseAttributes(req.body)

        const newVarient = { price, stock, attributes }

        if (req.files && req.files.length > 0) {
            const uploaded = await uploadFiles(req.files, 'snitch/variants')
            newVarient.images = uploaded.map(img => ({ url: img.url, fileId: img.fileId }))
        }

        product.varient.push(newVarient)
        await product.save()

        return res.status(201).json({ message: 'Variant added successfully', product })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export async function editVariant(req, res) {
    try {
        const { productId, variantId } = req.params

        const product = await productModel.findById(productId)
        if (!product) return res.status(404).json({ message: 'Product not found' })

        // ✅ Fixed: auth check BEFORE rest of logic, no code buried inside return block
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' })
        }

        const variant = product.varient.id(variantId)
        if (!variant) return res.status(404).json({ message: 'Variant not found' })

        const { price, stock } = req.body

        if (price !== undefined && price !== '') variant.price = Number(price)
        if (stock !== undefined && stock !== '') variant.stock = Number(stock)

        // Update attributes dynamically — merge with existing
        const incoming = parseAttributes(req.body)
        if (incoming.size > 0) {
            // Merge: keep existing attrs, override/add incoming ones
            incoming.forEach((val, key) => variant.attributes.set(key, val))
        }

        if (req.files && req.files.length > 0) {
            const uploaded = await uploadFiles(req.files, 'snitch/variants')
            variant.images = uploaded.map(img => ({ url: img.url, fileId: img.fileId }))
        }

        await product.save()
        return res.status(200).json({ message: 'Variant updated successfully', product })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export async function deleteVariant(req, res) {
    try {
        const { productId, variantId } = req.params

        const product = await productModel.findById(productId)
        if (!product) return res.status(404).json({ message: 'Product not found' })

        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' })
        }

        const variant = product.varient.id(variantId)
        if (!variant) return res.status(404).json({ message: 'Variant not found' })

        variant.deleteOne()
        await product.save()

        return res.status(200).json({ message: 'Variant deleted successfully', product })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export async function getAllProducts(req, res) {
    try {
        const products = await productModel.find()
        return res.status(200).json({ message: 'Products fetched successfully', products })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export async function getProductDetail(req, res) {
    try {
        const product = await productModel.findById(req.params.productId)
        if (!product) return res.status(404).json({ message: 'Product not found' })
        return res.status(200).json({ message: 'Product fetched successfully', product })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}
