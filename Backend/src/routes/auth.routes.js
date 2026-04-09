import express from 'express'
export const authRouter  = express.Router()
import {loginController, registerController} from '../controllers/auth.controller.js'
import {userValidationRules} from '../validator/register.validator.js'
import {loginValidationRules} from '../validator/login.validator.js'

authRouter.post('/register',userValidationRules ,registerController)
authRouter.post('/login',loginValidationRules,loginController)
