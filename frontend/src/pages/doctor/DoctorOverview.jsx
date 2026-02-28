import React, { useState, useEffect } from 'react'
import { CalendarDays, Users, Clock, TrendingUp, Loader2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const DoctorOverview = () => {
  const [statsData, setStatsData] = useState(null)
  const [schedule, setSchedule] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const [statsRes, scheduleRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/doctor/stats`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/doctor/appointments`, { withCredentials: true })
      ])
      setStatsData(statsRes.data.stats)
      // Filter for today's scheduled appointments for the preview
      const today = new Date().toLocaleDateString('en-CA')
      const todaysAppts = scheduleRes.data.filter(a => a.date === today && a.status === 'scheduled')
      setSchedule(todaysAppts.slice(0, 3))
    } catch (error) {
      toast.error("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    { title: "Today's Appointments", value: statsData?.todayAppointments || 0, icon: CalendarDays, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Appointments Handled', value: statsData?.totalAppointments || 0, icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
    { title: 'Prescriptions Issued', value: statsData?.totalCompleted || 0, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Status', value: 'Active', icon: TrendingUp, color: 'text-pink-600', bg: 'bg-pink-50' },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold border-b border-gray-200 pb-4 text-gray-800 tracking-tight">
          Welcome back, Dr. {user?.username}
        </h1>
        <p className="text-gray-500 mt-2">Here is a summary of your schedule and personal statistics for today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                </div>
                <div className={`${stat.bg} p-4 rounded-xl`}>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Schedule Preview */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Today's Remaining Schedule</h2>
            <Link to="/doctor/appointments" className="text-teal-600 text-sm font-medium hover:text-teal-700">View All</Link>
          </div>
          <div className="space-y-4">
            {schedule.length > 0 ? (
              schedule.map((appt) => (
                <div key={appt._id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="text-center bg-gray-100 px-3 py-2 rounded-lg min-w-[80px]">
                      <span className="block text-sm font-bold text-gray-800">{appt.time}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{appt.patient?.username}</h4>
                      <p className="text-sm text-gray-500">{appt.reason}</p>
                    </div>
                  </div>
                  <div>
                    <Link 
                      to={`/doctor/consultation/${appt._id}`}
                      className="px-4 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors"
                    >
                      Start Consult
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No scheduled appointments for today.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {schedule[0] ? (
              <Link 
                to={`/doctor/consultation/${schedule[0]._id}`}
                className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-teal-300 hover:bg-teal-50 transition-all group block"
              >
                <span className="font-medium text-gray-700 group-hover:text-teal-700 block">Start Next Consultation</span>
                <span className="text-sm text-gray-500 block mt-0.5">{schedule[0].patient?.username} • {schedule[0].time}</span>
              </Link>
            ) : (
                <div className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 opacity-50 block bg-gray-50">
                   <span className="font-medium text-gray-400 block">No Next Consultation</span>
                </div>
            )}
            <Link to="/doctor/appointments" className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all group block">
              <span className="font-medium text-gray-700 group-hover:text-blue-700 block">Review Full Schedule</span>
              <span className="text-sm text-gray-500 block mt-0.5">Manage upcoming appointments</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorOverview
