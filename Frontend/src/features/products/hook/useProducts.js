import { useDispatch } from 'react-redux'
import { createProduct, getSellerProducts, getAllProducts, getProductDetails, addVarient, editVarient, deleteVarient } from '../services/product.api'
import { setAllProducts, setSellerProducts, setSelectedProduct } from '../state/product.slice'

export function useProducts() {
    const dispatch = useDispatch()
    const handleCreateProduct = async (formData) => {
        const data = await createProduct(formData)
        return data.product

    }

    const handleSellerProducts = async () => {

        const data = await getSellerProducts()
        dispatch(setSellerProducts(data.products))
        return data.products
    }

    const handleAllProducts = async () => {
        const data = await getAllProducts()
        dispatch(setAllProducts(data.products))
    }

    const handleProductDetails = async (productId) => {
        const data = await getProductDetails(productId)
        dispatch(setSelectedProduct(data.product))
    }

    const handleAddVarient = async (productId, formData) => {
        const data = await addVarient(productId, formData)
        dispatch(setSelectedProduct(data.product))
        return data

    }

    const handleEditVarient = async (productId, varientId, formData) => {
        const data = await editVarient(productId, varientId, formData)
        dispatch(setSelectedProduct(data.product))
        return data
    }

    const handleDeleteVarient = async (productId, varientId) => {
    const data = await deleteVarient(productId, varientId)
    dispatch(setSelectedProduct(data.product))
    return data
}



    return { handleCreateProduct, handleSellerProducts, handleAllProducts, handleProductDetails,handleAddVarient,handleEditVarient,handleDeleteVarient }
}

