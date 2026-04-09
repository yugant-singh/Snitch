import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import {config} from '../config/config.js'

function generateToken(user){
    return jwt.sign({
        id:user._id,
    },
    config.JWT_SECRET,
    {
        expiresIn:'7d'
    }
    )
}   

export async function registerController(req,res){
    const {email,contact,password,fullName,profilePicture} = req.body
    try{
        const isUserExist = await userModel.findOne({
            $or:[
                {email},
                {contact}
            ]
        })

        if(isUserExist){
            return res.status(400).json({
                message:"User with this email or contact already exists"    
            })
        }
        const user = await userModel.create({
            email,
            contact,
            password,
            fullName,
            profilePicture
        })

        const token  = generateToken(user)
        return res.status(201).json({
            message:"User registered successfully",
            user:{
                id:user._id,
                contact:user.contact,
                email:user.email,
                fullName:user.fullName
                
            },
            token
        })



    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            message:"Server Error"
        })
    }

}