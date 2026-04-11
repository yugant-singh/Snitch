import { createBrowserRouter } from "react-router-dom"
import Register from "../features/auth/pages/Register"
import Login from "../features/auth/pages/Login"
import VerifyNoticePage from "../features/auth/pages/VerifyNoticePage"
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage"

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
    }

    ]
)