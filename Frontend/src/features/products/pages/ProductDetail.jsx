import React, { useEffect } from 'react'
import {useProducts} from '../hook/useProducts'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProductDetail = () => {
    const {productId} = useParams()
    const {handleProductDetails} = useProducts()
  const product = useSelector((state) => state.product.selectedProduct)


  console.log(product)
    useEffect(()=>{
        handleProductDetails(productId)
    },[productId])
  return (
    <div>ProductDetail</div>
  )
}

export default ProductDetail