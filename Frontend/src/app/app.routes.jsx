import { createBrowserRouter } from "react-router-dom"

export const routes  = createBrowserRouter([
    {

        path:'/',
        element:<h1>Home Page</h1>
    },
    {
        path:'/login',
        element:<h1>Login Page</h1>
    },
    {
        path:'/register',
        element:<h1>Register Page</h1>
    }

    ]
)