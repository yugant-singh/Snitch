import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'



const Protected = ({children,allowedRole}) => {
   
    const user  = useSelector(state=>state.auth.user)
    const loading  = useSelector(state=>state.auth.loading)

   if(loading){
    return <div><h1>Loading</h1></div>
}

if(!user){
    return <Navigate to={'/login'}/>
}

 if(allowedRole && user.role !== allowedRole){
       if(user.role ==='seller'){
        return <Navigate to={'/seller/dashboard'}/>
       }

       return <Navigate to={'/'}/>
    }
    

  return  children
  
}

export default Protected