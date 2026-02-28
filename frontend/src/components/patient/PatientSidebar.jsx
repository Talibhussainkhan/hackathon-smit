import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CalendarClock, Pill, LogOut, X } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logoutSuccess } from '../../redux/authSlice'
import axios from 'axios'
import toast from 'react-hot-toast'

const PatientSidebar = ({ isOpen, setIsOpen }) => {
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
    { name: 'My Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'My Appointments', path: '/patient/appointments', icon: CalendarClock },
    { name: 'My Prescriptions', path: '/patient/prescriptions', icon: Pill },
  ]

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-emerald-100 flex flex-col h-full shadow-xl lg:shadow-sm
      transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-bold text-xl shadow-sm">
              P
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 leading-tight">Patient Portal</h2>
              <p className="text-xs text-emerald-600 font-medium tracking-wide bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                Secure Access
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm border border-emerald-100'
                    : 'text-gray-600 hover:bg-emerald-50/50 hover:text-gray-900 border border-transparent font-medium'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="p-4 border-t border-emerald-50 bg-emerald-50/30">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 text-red-600 hover:bg-white hover:shadow-sm w-full px-4 py-3 rounded-xl transition-all duration-200 justify-center border border-transparent hover:border-red-100"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default PatientSidebar
