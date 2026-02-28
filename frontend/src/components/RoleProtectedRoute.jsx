import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth)
  
  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  // Logged in but no role or role is not allowed
  if (!user.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  
  return children
}

export default RoleProtectedRoute
