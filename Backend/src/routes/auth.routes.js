import express from 'express'
export const authRouter  = express.Router()
import {registerController} from '../controllers/auth.controller.js'
import {userValidationRules} from '../validator/auth.validator.js'

authRouter.post('/register',userValidationRules ,registerController)