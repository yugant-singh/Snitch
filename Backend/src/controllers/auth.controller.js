import crypto from 'crypto'
import userModel from '../models/user.model.js'
import { imagekit } from '../utils/imagekit.js'
import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'
import { sendVerificationEmail } from '../utils/sendEmail.js'
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
/*
    @desc Register a new user
    @route POST /api/auth/register
    @access Public
*/
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

        const verificationToken = crypto.randomBytes(32).toString('hex')
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
        user.verificationToken = verificationToken
        user.verificationTokenExpiry = verificationTokenExpiry
        await user.save({ validateBeforeSave: false })
        const verificationLink = `${config.CLIENT_URL}/verify-email?token=${verificationToken}`
        await sendVerificationEmail(user.email, verificationLink)
        const token = generateToken(user)

        return res.status(201).json({
            message: "Registration successful! Please verify your email.",
            user: {
                id: user._id,
                contact: user.contact,
                email: user.email,
                fullName: user.fullName

            },

        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Server Error"
        })
    }

}
/*
    @desc login user
    @route POST /api/auth/login
    @access Public
*/
export async function loginController(req, res) {
    const { email, password, contact } = req.body
    try {

        const user = await userModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        })
        if (!user) {
            return res.status(404).json({
                message: "User not found "
            })
        }
        const isMatch = await user.comparePassword(password)

        if (!isMatch) {
            return res.status(400).json({
                message: "Password is invalid"
            })
        }

        if (!user.isVerified) {
            return res.status(400).json({
                message: "'Please verify your email before logging in'"
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
            message: "Server  Error"
        })
    }

}

/*
    @desc Get user profile
    @route POST /api/auth/get-me
    @access private
*/

export async function getMeController(req, res) {

    try {
        const userId = req.user.id
        const user = await userModel.findById(userId)

        return res.status(200).json({
            user: {
                email: user.email,
                contact: user.contact,
                fullName: user.fullName,
                profilePicture: user.profilePicture
            }
        })
    }

    catch (error) {
        return res.status(500).json({
            message: "Server  Error"
        })
    }
}

/*
    @desc Verify email
    @route GET /api/auth/verify-email?token=xxxx
    @access Public
*/
export async function verifyEmailController(req, res) {
    const { token } = req.query
    try {
        // Step 1: Token se user dhundo
        const user = await userModel.findOne({
            verificationToken: token,
            verificationTokenExpiry: { $gt: new Date() }  // expiry check
        })

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired verification token"
            })
        }

        user.isVerified = true
        user.verificationToken = null
        user.verificationTokenExpiry = null
        await user.save({ validateBeforeSave: false })
        return res.status(200).json({
            message: "Email verified successfully!"
        })

    }
    catch (error) {
        return res.status(500).json({
            message: "Server  Error"
        })
    }
}

/*
@desc resend verification email
@route POST /api/auth/resend-verification-email
@access Private
*/

export async function resendVerificationEmailController(req, res) {
    const { email } = req.body
    console.log(email)
    try {

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        if (user.isVerified) {
            return res.status(400).json({
                message: "Email is already verified"
            })
        }
        const verificationToken = crypto.randomBytes(32).toString('hex')
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
        user.verificationToken = verificationToken
        user.verificationTokenExpiry = verificationTokenExpiry
        await user.save({ validateBeforeSave: false })
        const verificationLink = `${config.CLIENT_URL}/verify-email?token=${verificationToken}`
        await sendVerificationEmail(user.email, verificationLink)
        return res.status(200).json({
            message: "Verification email resent successfully"
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Server Error"
        })
    }

}

/*
@desc resend update user profile
@route POST /api/auth/profilePicture
@access Private
*/
export async function updateProfileController(req, res) {

    try {
        const userId = req.user.id
        const { contact, fullName } = req.body
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        if (fullName) user.fullName = fullName
        if (contact) user.contact = contact

        if (req.file) {
            const uploadImage = await imagekit.upload({
                file: req.file.buffer,
                fileName: Date.now() + "-" + req.file.originalname,
                folder: "snitch/profile_pictures"
            })
               user.profilePicture=uploadImage.url
        }

     
        await user.save()

        return res.status(200).json({
            message:"Profile updated successfully",
            user:{
                email:user.email,
                fullName:user.fullName,
                contact:user.contact,
                profilePicture:user.profilePicture
            }
        })
    }
     catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
