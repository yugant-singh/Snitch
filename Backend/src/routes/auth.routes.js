import express from 'express'
export const authRouter  = express.Router()
import {loginController, registerController,getMeController, verifyEmailController, resendVerificationEmailController} from '../controllers/auth.controller.js'
import {userValidationRules} from '../validator/register.validator.js'
import {loginValidationRules} from '../validator/login.validator.js'
import {authVerification} from '../middleware/auth.middleware.js'

authRouter.post('/register',userValidationRules ,registerController)
authRouter.post('/login',loginValidationRules,loginController)
authRouter.get('/get-me',authVerification,getMeController)
authRouter.get('/verify-email',verifyEmailController)
authRouter.post('/resend-verification',resendVerificationEmailController)