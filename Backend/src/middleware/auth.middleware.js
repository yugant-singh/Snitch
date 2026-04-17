import {config} from '../config/config.js'
import jwt  from 'jsonwebtoken'
import {redis} from '../config/cache.js'
import userModel from '../models/user.model.js'


export async function authenticateUser (req,res,next){

    const token  = req.cookies.token
    try{

        if(!token){
            return res.status(400).json({
                message:"Token not provided"
            })
        }
  
        const isBlacklisted = await redis.get(token)
        if(isBlacklisted){
            return res.status(400).json({
                message:"Token is blacklisted"
            })
        }
        let decode = null
     
    try{
         decode= jwt.verify(token,config.JWT_SECRET)
        req.user  = decode
        next()
    }
    catch(error){
        return res.status(400).json({
            message:"Token is invalid"
        })
    }

    }
    catch(error){
        return res.status(500).json({
            message:"Server Error"
        })
    }
}


export const authenticateSeller = async (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {

        const decoded = jwt.verify(token, config.JWT_SECRET)

        const user = await userModel.findById(decoded.id)

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        if (user.role !== "seller") {
            return res.status(403).json({ message: "Forbidden" })
        }

        req.user = user
        next()

    } catch (err) {
        console.log(err)
        return res.status(401).json({ message: "Unauthorized" })
    }
}