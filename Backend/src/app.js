import express from 'express'
import {authRouter} from '../src/routes/auth.routes.js'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import cors from 'cors'
import morgan from 'morgan'
import { config } from './config/config.js'
const app = express()
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())
passport.use(new GoogleStrategy({
    clientID:config.CLIENT_ID,
    clientSecret:config.CLIENT_SECRET,
    callbackURL:"http://localhost:3000/api/auth/google/callback"
},
(accessToken,refreshToken,profile,done)=>{  
    return done(null,profile)
}
))

app.use('/api/auth',authRouter)
export default app