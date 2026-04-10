import React from 'react'
import { RouterProvider } from 'react-router-dom'
import {routes} from '../src/app/app.routes.jsx'
const App = () => {
  return (
 <RouterProvider router={routes}>
     <div >App</div>
 </RouterProvider>
  )
}

export default App