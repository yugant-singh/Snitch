import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name:"product",
    initialState:{
        sellerProducts:[],
        products:[],
        selectedProduct: null
    },
    reducers:{
        setSellerProducts:(state,action)=>{
            state.sellerProducts = action.payload
        },
        setAllProducts:(state,action)=>{
            state.products = action.payload
        },
        setSelectedProduct:(state,action)=>{
            state.selectedProduct = action.payload
        }
    }
})

export const {setSellerProducts,setAllProducts,setSelectedProduct} = productSlice.actions
export default productSlice.reducer