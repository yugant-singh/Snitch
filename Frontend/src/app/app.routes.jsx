import { createBrowserRouter } from "react-router-dom"
import Register from "../features/auth/pages/Register"
import Login from "../features/auth/pages/Login"
import VerifyNoticePage from "../features/auth/pages/VerifyNoticePage"
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage"
import GoogleSuccessPage from '../features/auth/pages/GoogleSuccessPage'
import CreateProduct from '../features/products/pages/CreateProduct'
import Dashboard from "../features/products/pages/Dashboard"
import Protected from "../features/auth/components/Protected"
import Home from '../features/products/pages/Home'
import ProductDetail from "../features/products/pages/ProductDetail"

export const routes = createBrowserRouter([
    {

        path: '/',
        element:<Home/>
    },
    {
        path:'/product/:productId',
        element:<ProductDetail/>
    },

    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    }, {
        path: '/verify',
        element: <VerifyNoticePage />
    },
    {
        path: '/verify-email',
        element: <VerifyEmailPage />
    },
    {
        path: '/google-success',
        element: <GoogleSuccessPage />
    },
    {
        path: '/seller',
        children: [
            {
                path: 'create-product',  // ✅ slash aur /seller hata do
                element: (
                    <Protected allowedRole="seller">
                        <CreateProduct />
                    </Protected>
                )
            },
            {
                path: 'dashboard',       // ✅ yahan bhi
                element:  <Protected allowedRole="seller">
                     <Dashboard/>
                    </Protected>
            }
        ]
    }

]
)