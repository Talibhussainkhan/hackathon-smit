import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutSuccess } from '../redux/authSlice'
import { LogOut } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const RoleRedirect = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const handleLogout = async () => {
    try {
      await axios.get(`${backendUrl}/api/auth/signout`, { withCredentials: true })
      dispatch(logoutSuccess())
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Failed to log out')
      console.error(error)
    }
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Redirect based on role
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />
    case 'doctor':
      return <Navigate to="/doctor/dashboard" replace />
    case 'receptionist':
      return <Navigate to="/receptionist/dashboard" replace />
    case 'patient':
      return <Navigate to="/patient/dashboard" replace />
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
            <p className="text-gray-500 mb-6 font-medium">
              We couldn't determine your account role. Please contact support or try logging in again.
            </p>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )
  }
}

export default RoleRedirect
