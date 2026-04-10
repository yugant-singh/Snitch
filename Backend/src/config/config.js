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

if(!process.env.URL_END_POINT){
    throw new Error("URL_END_POINT is not defined in .env file")
}
if(!process.env.IAMGE_KIT_PUBLIC_KEY){
    throw new Error("IAMGE_KIT_PUBLIC_KEY is not defined in .env file")
}
if(!process.env.IAMGE_KIT_PRIVATE_KEY){
    throw new Error("IAMGE_KIT_PRIVATE_KEY is not defined in .env file")
}

if(!process.env.REDIS_HOST){
    throw new Error("REDIS_HOST is not defined in .env file")
}
if(!process.env.REDIS_PORT){
    throw new Error("REDIS_PORT is not defined in .env file")
}
if(!process.env.REDIS_PASSWORD){
    throw new Error("REDIS_PASSWORD is not defined in .env file")
}

export const config = {
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    EMAIL_USER:process.env.EMAIL_USER,
    EMAIL_PASS:process.env.EMAIL_PASS,
    CLIENT_URL:process.env.CLIENT_URL,
    URL_END_POINT:process.env.URL_END_POINT,
    IAMGE_KIT_PUBLIC_KEY:process.env.IAMGE_KIT_PUBLIC_KEY,
    IAMGE_KIT_PRIVATE_KEY:process.env.IAMGE_KIT_PRIVATE_KEY,
    REDIS_HOST:process.env.REDIS_HOST,
    REDIS_PORT:process.env.REDIS_PORT,
    REDIS_PASSWORD:process.env.REDIS_PASSWORD
}