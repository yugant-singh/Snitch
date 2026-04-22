import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { routes } from './app/app.routes.jsx'
import { useSelector } from 'react-redux'
import {useAuth} from '../src/features/auth/hook/useAuth.js'




const App = () => {
  const {handleGetMe} = useAuth()
  const user  = useSelector(state=>state.auth.user)
  useEffect(()=>{

    handleGetMe()
  },[])


  return <RouterProvider router={routes} />
}

export default App