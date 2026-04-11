import axios from 'axios'

const apiInstance = axios.create({
    baseURL:"http://localhost:3000/api/auth",
    withCredentials:true
})

export async function register({email,contact,password,fullName,isSeller}){
    const response  = await apiInstance.post('/register',{
        email,
        contact,
        password,
        fullName,
        isSeller 
    })
    return response.data
}

export async function verifyEmail(token){
    const response = await apiInstance.get(`/verify-email?token=${token}`)
    return response.data
}

