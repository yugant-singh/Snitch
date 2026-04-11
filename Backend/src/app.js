import express from 'express'
import {authRouter} from '../src/routes/auth.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
const app = express()
app.use(morgan("dev"))
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
app.use(cookieParser())
app.use('/api/auth',authRouter)
export default app