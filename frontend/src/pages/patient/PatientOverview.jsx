import React, { useState, useEffect } from 'react'
import { Activity, Heart, Scale, CalendarClock, User, Phone, MapPin, Loader2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

const PatientOverview = () => {
  const { user } = useSelector(state => state.auth)
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/patient/stats`, { withCredentials: true })
      setDashboardData(data)
    } catch (error) {
      toast.error("Failed to load health summary")
    } finally {
      setIsLoading(false)
    }
  }

  const healthVitals = [
    { title: 'Appointments', value: dashboardData?.stats?.totalAppointments || 0, icon: CalendarClock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Prescriptions', value: dashboardData?.stats?.totalPrescriptions || 0, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Age', value: dashboardData?.profile?.age || user?.age || 'N/A', icon: User, color: 'text-orange-500', bg: 'bg-orange-50' },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold border-b border-emerald-100 pb-4 text-gray-800 tracking-tight">
          Welcome back, {user?.username?.split(' ')[0]}
        </h1>
        <p className="text-gray-500 mt-2">Here is a quick overview of your health profile and upcoming schedule.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-emerald-50 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-emerald-600 font-bold text-4xl shadow-sm mb-4">
            {user?.username?.charAt(0)}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{user?.username}</h2>
          <p className="text-gray-500 text-sm font-medium mb-6">Patient ID: #{user?._id?.slice(-4).toUpperCase()} • Age: {user?.age || 'N/A'}</p>
          
          <div className="w-full space-y-4 text-left border-t border-gray-100 pt-6">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-3 text-emerald-500" /> {user?.phone || 'Not provided'}
            </div>
            <div className="flex items-center text-sm text-gray-600 border-t border-gray-50 pt-4">
              <User className="w-4 h-4 mr-3 text-emerald-500" /> {user?.email}
            </div>
            <div className="flex items-center text-sm text-gray-600 border-t border-gray-50 pt-4">
              <MapPin className="w-4 h-4 mr-3 text-emerald-500 flex-shrink-0" /> Wellness Center Patient
            </div>
          </div>
        </div>

        {/* Vitals & Upcoming */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Health Summary */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-50">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Health Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {healthVitals.map((vital, index) => {
                const Icon = vital.icon
                return (
                  <div key={index} className={`${vital.bg} border border-white p-4 rounded-2xl flex items-center space-x-4 shadow-sm`}>
                    <div className="bg-white p-2 rounded-xl shadow-sm">
                      <Icon className={`w-6 h-6 ${vital.color}`} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{vital.title}</p>
                      <p className={`text-xl font-extrabold ${vital.color}`}>{vital.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Upcoming Appointment */}
          {dashboardData?.nextAppointment ? (
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 shadow-md text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 text-white/10 transform translate-x-4 -translate-y-4">
                <CalendarClock className="w-32 h-32" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <p className="text-emerald-100 font-medium mb-1 tracking-wide uppercase text-sm">Next Appointment</p>
                  <h3 className="text-2xl font-bold mb-2">{new Date(dashboardData.nextAppointment.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} • {dashboardData.nextAppointment.time}</h3>
                  <p className="text-emerald-50 text-sm flex items-center mb-1">
                    <User className="w-4 h-4 mr-1 pb-0.5" /> Dr. {dashboardData.nextAppointment.doctor?.username}
                  </p>
                  <p className="text-emerald-50 text-sm opacity-80">Reason: {dashboardData.nextAppointment.reason}</p>
                </div>
                <div className="mt-6 md:mt-0 bg-white/20 px-4 py-2 rounded-xl border border-white/30 backdrop-blur-sm">
                   <span className="text-xs font-bold uppercase tracking-wider">Scheduled</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-3xl p-8 shadow-inner border border-gray-200 text-center flex flex-col items-center">
               <CalendarClock className="w-12 h-12 text-gray-300 mb-3" />
               <h3 className="text-gray-600 font-bold text-lg">No Upcoming Appointments</h3>
               <p className="text-gray-400 text-sm">Please contact the clinic if you'd like to book one.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default PatientOverview
