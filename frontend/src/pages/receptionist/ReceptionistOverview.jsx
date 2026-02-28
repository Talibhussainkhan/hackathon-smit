import React, { useState, useEffect } from 'react'
import { Users, Clock, CalendarCheck, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const ReceptionistOverview = () => {
  const [schedule, setSchedule] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [submittingId, setSubmittingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTodaySchedule()
  }, [])

  const fetchTodaySchedule = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/receptionist/schedule`, { withCredentials: true })
      setSchedule(data)
    } catch (error) {
      toast.error("Error fetching today's schedule")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (id, status) => {
    setSubmittingId(id)
    try {
       await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/receptionist/appointment-status/${id}`, { status }, { withCredentials: true })
       toast.success(`Patient marked as ${status}`)
       fetchTodaySchedule()
    } catch (error) {
       toast.error("Status update failed")
    } finally {
       setSubmittingId(null)
    }
 }

  // Calculate stats from schedule
  const totalPatients = schedule.length
  const waitingPatients = schedule.filter(a => a.status === 'scheduled').length
  const completedPatients = schedule.filter(a => a.status === 'completed').length
  const cancelledPatients = schedule.filter(a => a.status === 'cancelled').length

  const stats = [
    { title: "Today's Total Patients", value: totalPatients.toString(), icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Waiting Room', value: waitingPatients.toString(), icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Completed Visits', value: completedPatients.toString(), icon: CalendarCheck, color: 'text-teal-600', bg: 'bg-teal-50' },
    { title: 'No Shows / Cancelled', value: cancelledPatients.toString(), icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ]

  const waitingList = schedule.filter(a => a.status === 'scheduled')

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold border-b border-rose-100 pb-4 text-gray-800 tracking-tight">
          Front Desk Overview
        </h1>
        <div className="flex justify-between items-center mt-2">
           <p className="text-gray-500">Manage clinic flow and track patient arrivals for today.</p>
           <p className="text-sm font-bold text-rose-500">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50 hover:shadow-md hover:border-rose-100 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                </div>
                <div className={`${stat.bg} p-4 rounded-xl shadow-sm`}>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Waiting Room List */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-rose-50 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-rose-500" />
              Live Waiting Room
            </h2>
            <button 
              onClick={fetchTodaySchedule}
              className="text-sm font-medium bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors"
            >
              Refresh
            </button>
          </div>
          
          <div className="overflow-x-auto flex-1">
            {isLoading ? (
               <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <p>Updating waiting room...</p>
               </div>
            ) : waitingList.length > 0 ? (
                <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
                    <th className="px-4 py-3 font-semibold text-xs tracking-wider uppercase">Patient</th>
                    <th className="px-4 py-3 font-semibold text-xs tracking-wider uppercase">Appt Time</th>
                    <th className="px-4 py-3 font-semibold text-xs tracking-wider uppercase">Doctor</th>
                    <th className="px-4 py-3 text-right font-semibold text-xs tracking-wider uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {waitingList.map((item) => (
                    <tr key={item._id} className="hover:bg-rose-50/30 transition-colors">
                        <td className="px-4 py-4 font-bold text-gray-900">{item.patient?.username}</td>
                        <td className="px-4 py-4 text-gray-600 text-sm font-medium">{item.time}</td>
                        <td className="px-4 py-4 text-gray-600 text-sm">{item.doctor?.username}</td>
                        <td className="px-4 py-4 text-right">
                            <button 
                              onClick={() => handleStatusUpdate(item._id, 'completed')}
                              disabled={submittingId === item._id}
                              className="flex items-center justify-end w-full text-teal-600 hover:text-teal-800 font-semibold text-sm transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submittingId === item._id ? (
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                                )}
                                {submittingId === item._id ? 'Updating...' : 'Send In / Complete'}
                            </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            ) : (
                <div className="flex flex-col items-center justify-center h-full py-12 text-gray-400">
                    <Clock className="w-12 h-12 mb-2 text-gray-200" />
                    <p className="font-medium">The waiting room is currently empty.</p>
                </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Quick Front Desk Actions</h2>
          <div className="space-y-4 pt-2">
            <button 
              onClick={() => navigate('/receptionist/patients')}
              className="w-full relative overflow-hidden group bg-gradient-to-br from-rose-500 to-pink-600 text-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-left"
            >
              <div className="relative z-10">
                <span className="font-bold block text-lg">Register Walk-In</span>
                <span className="text-rose-100 text-xs mt-1 block">Quick add a new patient to today's queue</span>
              </div>
              <div className="absolute right-0 bottom-0 text-white/20 transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform duration-500">
                <Users className="w-24 h-24" />
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/receptionist/appointments')}
              className="w-full relative overflow-hidden group bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-left"
            >
              <div className="relative z-10">
                <span className="font-bold block text-lg">Book Appointment</span>
                <span className="text-indigo-100 text-xs mt-1 block">Schedule for a future date or today</span>
              </div>
              <div className="absolute right-0 bottom-0 text-white/20 transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform duration-500">
                <Clock className="w-24 h-24" />
              </div>
            </button>
            
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-2 italic">Clinic Tip</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Remember to verify insurance and contact details for all walk-in registrations before completing the check-in process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReceptionistOverview
