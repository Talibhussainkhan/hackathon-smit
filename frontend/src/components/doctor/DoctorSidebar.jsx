import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, Stethoscope, LogOut } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logoutSuccess } from '../../redux/authSlice'
import axios from 'axios'
import toast from 'react-hot-toast'

const DoctorSidebar = () => {
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
    { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', path: '/doctor/appointments', icon: CalendarDays },
    { name: 'Consultation', path: '/doctor/consultation', icon: Stethoscope },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xl">
            D
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 leading-tight">Doctor Portal</h2>
            <p className="text-xs text-gray-500 font-medium tracking-wide border border-teal-200 bg-teal-50 px-2 py-0.5 rounded-full inline-block mt-1">
              Active Shift
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-6">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 font-medium'
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
          className="flex items-center space-x-3 text-red-600 hover:bg-red-50 w-full px-4 py-3 rounded-xl transition-colors duration-200 justify-center"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default DoctorSidebar
