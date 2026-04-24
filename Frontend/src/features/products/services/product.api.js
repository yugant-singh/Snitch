import axios from 'axios'

const productApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials: true
})

export async function createProduct(formData) {
    const form = new FormData()
    form.append('title', formData.title)
    form.append('description', formData.description)
    form.append('priceAmount', formData.priceAmount)
    formData.images.forEach((image) => form.append('images', image))

    const response = await productApiInstance.post('/', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
}

export async function getSellerProducts() {
    const response = await productApiInstance.get('/seller')
    return response.data
}

export async function getAllProducts() {
    const response = await productApiInstance.get('/')
    return response.data
}

export async function getProductDetails(productId) {
    const response = await productApiInstance.get(`/${productId}`)
    return response.data
}


export async function addVarient(productId, formData) {
    const response = await productApiInstance.post(`/${productId}/varient`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
}

export async function editVarient(productId, varientId, formData) {
    const response = await productApiInstance.put(`/${productId}/varient/${varientId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
}

export async function deleteVarient(productId, varientId) {
    const response = await productApiInstance.delete(`/${productId}/varient/${varientId}`)
    return response.data
}