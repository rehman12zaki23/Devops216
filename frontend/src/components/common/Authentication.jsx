import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const Authentication = ({ isAuthenticated, user, children }) => {
  const location = useLocation()
  const path = location.pathname

  const isLogin = path.includes('/login')
  const isSignup = path.includes('/signup')
  const isAuthRoute = isLogin || isSignup
  const isAdminRoute = path.startsWith('/admin')

  if (isAuthenticated && !user) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
    </div>
  }

  if (!isAuthenticated && !isAuthRoute) {
    return <Navigate to='/auth/login' />
  }

  if (isAuthenticated && isAuthRoute) {
    return user?.role === 'admin' ? <Navigate to='/admin/dashboard' /> : <Navigate to='/home/homepage' />
  }

  if (isAuthenticated && user?.role === 'admin' && !isAdminRoute) {
    return <Navigate to='/admin/dashboard' />
  }

  if (isAuthenticated && user?.role !== 'admin' && isAdminRoute) {
    return <Navigate to='/home' />
  }

  return <>{children}</>
}

export default Authentication


