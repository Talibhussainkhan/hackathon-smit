import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, UserRoundCog, CreditCard, LogOut } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logoutSuccess } from '../redux/authSlice'
import axios from 'axios'
import toast from 'react-hot-toast'

const AdminSidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const handleLogout = async () => {
    try {
      await axios.get(`${backendUrl}/api/auth/signout`, { withCredentials: true })
      dispatch(logoutSuccess())
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      toast.error('Failed to log out')
      console.error(error)
    }
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Doctors', path: '/admin/doctors', icon: Users },
    { name: 'Manage Receptionists', path: '/admin/receptionists', icon: UserRoundCog },
    { name: 'Subscriptions', path: '/admin/subscriptions', icon: CreditCard },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Clinic Admin
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 text-red-600 hover:bg-red-50 w-full px-4 py-3 rounded-xl transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar
