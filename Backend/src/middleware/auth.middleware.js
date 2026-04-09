import {config} from '../config/config.js'
import jwt  from 'jsonwebtoken'

export async function authVerification(req,res,next){

    const token  = req.cookies.token
    try{

        if(!token){
            return res.status(400).json({
                message:"Token not provided"
            })
        }
        console.log("VERIFY SECRET:", config.JWT_SECRET)
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


