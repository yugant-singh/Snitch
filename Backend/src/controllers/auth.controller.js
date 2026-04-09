import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'
import bcrypt from 'bcryptjs'

function generateToken(user) {
    return jwt.sign({
        id: user._id,
    },
        config.JWT_SECRET,
        {
            expiresIn: '7d'
        }
    )
}

export async function registerController(req, res) {
    const { email, contact, password, fullName, profilePicture } = req.body
    try {
        const isUserExist = await userModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        })

        if (isUserExist) {
            return res.status(400).json({
                message: "User with this email or contact already exists"
            })
        }
        const user = await userModel.create({
            email,
            contact,
            password,
            fullName,
            profilePicture
        })

        const token = generateToken(user)
        res.cookie("token", token)
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                contact: user.contact,
                email: user.email,
                fullName: user.fullName

            },
            token
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Server Error"
        })
    }

}

export async function loginController(req, res) {
    const { email, password,contact } = req.body
    try {

        const user = await userModel.findOne({
            $or:[
                {email},
                {contact}
            ]
        })
        if (!user) {
            return res.status(404).json({
                message: "User not found "
            })
        }

     const isMatch = await bcrypt.compare(password,user.password)

     if(!isMatch){
        return res.status(400).json({
            message:"Password is invalid"
        })
     }
     

        const token = generateToken(user)
        res.cookie("token", token)
        return res.status(200).json({
            message: "user loggedin successfully",
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                contact: user.contact
            }, token
        })

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Server Error"
        })
    }

}