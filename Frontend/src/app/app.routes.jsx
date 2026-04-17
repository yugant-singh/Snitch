import { createBrowserRouter } from "react-router-dom"
import Register from "../features/auth/pages/Register"
import Login from "../features/auth/pages/Login"
import VerifyNoticePage from "../features/auth/pages/VerifyNoticePage"
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage"
import GoogleSuccessPage from '../features/auth/pages/GoogleSuccessPage'
import CreateProduct from '../features/products/pages/CreateProduct'

export const routes  = createBrowserRouter([
    {

        path:'/',
        element:<h1>Home Page</h1>
    },
    {
        path:'/login',
        element:<Login/>
    },
    {
        path:'/register',
        element:<Register/>
    },{
        path:'/verify',
        element:<VerifyNoticePage/>
    },
    {
        path:'/verify-email',
        element:<VerifyEmailPage/>
    },
    {
        path:'/google-success',
        element:<GoogleSuccessPage/>
    },
    {
        path:'/create-product',
        element:<CreateProduct/>
    }

    ]
)