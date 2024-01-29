'use client'
import { FC, useState } from 'react'
import Auth from './components/Auth/Auth'
import Dashboard from './components/Dashboard/Dashboard'


const Admin: FC = () => {
  const [IsAdmin, SetIsAdmin] = useState(true)
  
  return (
    !IsAdmin ? <Auth SetIsAdmin={SetIsAdmin}/> : <Dashboard/>
  )
}

export default Admin