import { useDispatch } from 'react-redux'
import {createProduct,getSellerProducts} from '../services/product.api'
import { setSellerProducts } from '../state/product.slice'

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

return {handleCreateProduct,handleSellerProducts}
}

