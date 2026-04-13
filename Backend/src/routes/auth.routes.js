import express from 'express'
export const authRouter  = express.Router()
import {loginController,
     registerController,
     getMeController, 
     verifyEmailController, 
     resendVerificationEmailController, 
     updateProfileController,
     googleAuthController,
     logoutController} from '../controllers/auth.controller.js'
import {userValidationRules} from '../validator/register.validator.js'
import {loginValidationRules} from '../validator/login.validator.js'
import {authVerification} from '../middleware/auth.middleware.js'
import { upload } from '../middleware/upload.middleware.js'
import passport from 'passport'




authRouter.post('/register',userValidationRules ,registerController)
authRouter.post('/login',loginValidationRules,loginController)
authRouter.get('/get-me',authVerification,getMeController)
authRouter.get('/verify-email',verifyEmailController)
authRouter.post('/resend-verification',resendVerificationEmailController)
authRouter.put('/update-profile',authVerification,upload.single("profilePicture"),updateProfileController)
authRouter.get('/logout',authVerification,logoutController)


// Google OAuth routes
authRouter.get('/google',
      passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/google/callback',
     passport.authenticate('google',{session:false}),googleAuthController)

