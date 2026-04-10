import dotenv from 'dotenv'

dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in .env file")
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in .env file")
}

if(!process.env.EMAIL_USER){
    throw new Error("EMAIL_USER is not defined in .env file")
}
if(!process.env.EMAIL_PASS){
    throw new Error("EMAIL_PASS is not defined in .env file")
}
if(!process.env.CLIENT_URL){
    throw new Error("CLIENT_URL is not defined in .env file")
}
export const config = {
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    EMAIL_USER:process.env.EMAIL_USER,
    EMAIL_PASS:process.env.EMAIL_PASS,
    CLIENT_URL:process.env.CLIENT_URL
}