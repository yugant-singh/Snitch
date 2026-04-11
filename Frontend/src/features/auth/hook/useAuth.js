import { setUser, setError, setLoading } from '../state/auth.slice'
import { register, verifyEmail, login } from '../services/auth.api'
import { useDispatch } from 'react-redux'


export const useAuth = () => {
    const dispatch = useDispatch()

    async function handleRegister({ email, contact, password, fullName, isSeller = false }) {
        try {
            dispatch(setLoading(true))
            const data = await register({ email, contact, password, fullName, isSeller })
            dispatch(setUser(data.user))
        }
       catch (err) {
    const errors = err.response?.data?.errors

    if (errors) {
        const formattedErrors = {}

        errors.forEach(e => {
            formattedErrors[e.path] = e.msg
        })

        dispatch(setError(formattedErrors))
    } else {
        // 🔥 YE ADD KARO (important)
        dispatch(setError({
            general: err.response?.data?.message
        }))
    }

    throw err
}

        finally {
            dispatch(setLoading(false))
        }
    }


    async function handleVerifyEmail(token) {
        try {
            dispatch(setLoading(true))
            const data = await verifyEmail(token)
            return data
        }
        catch (err) {
            dispatch(setError(err.response?.data?.message))
        }
        finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true))
            const data = await login({ email, password })
            dispatch(setUser(data.user))
        }
       catch (err) {
    const errors = err.response?.data?.errors

    if (errors) {
        const formattedErrors = {}

        errors.forEach(e => {
            formattedErrors[e.path] = e.msg
        })

        dispatch(setError(formattedErrors))
    } else {
        // 🔥 YE ADD KARO (important)
        dispatch(setError({
            general: err.response?.data?.message
        }))
    }

    throw err
}
        finally {
            dispatch(setLoading(false))
        }

    }

    return { handleRegister, handleVerifyEmail, handleLogin }


}