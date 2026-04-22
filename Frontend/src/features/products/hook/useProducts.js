import { useDispatch } from 'react-redux'
import {createProduct,getSellerProducts,getAllProducts,getProductDetails} from '../services/product.api'
import { setAllProducts, setSellerProducts,setSelectedProduct } from '../state/product.slice'

export function useProducts(){
    const dispatch = useDispatch()
const handleCreateProduct = async (formData)=>{
    const data  = await createProduct(formData)
    return data.product

}

const handleSellerProducts = async ()=>{

    const data  = await getSellerProducts()
    dispatch(setSellerProducts(data.products))
    return data.products
}

const handleAllProducts = async ()=>{
    const data  = await getAllProducts()
    dispatch(setAllProducts(data.products))
}

const handleProductDetails = async (productId)=>{
    const data  = await getProductDetails(productId)
        dispatch(setSelectedProduct(data.product))
    }




return {handleCreateProduct,handleSellerProducts,handleAllProducts,handleProductDetails}
}

