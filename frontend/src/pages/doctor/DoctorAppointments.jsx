import React, { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, Clock, User, Filter, Search, FileText, Loader2, Play } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const DoctorAppointments = () => {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/doctor/appointments`, { withCredentials: true })
      setAppointments(data)
    } catch (error) {
      toast.error("Error fetching appointments")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAppointments = appointments.filter(appt => {
    const patientName = appt.patient?.username?.toLowerCase() || ''
    if (filter !== 'All' && appt.status !== filter.toLowerCase()) return false
    if (search && !patientName.includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Appointments & History</h1>
          <p className="text-gray-500 mt-1">Manage your schedule and access patient records.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters & Search */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center bg-gray-50/50 gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2 outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Appointments</option>
              <option value="Scheduled">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* List View */}
        <div className="divide-y divide-gray-50 min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20 text-gray-400">
               <Loader2 className="w-10 h-10 animate-spin mb-2" />
               <p>Fetching schedule...</p>
            </div>
          ) : filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt) => (
              <div key={appt._id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {appt.patient?.username?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{appt.patient?.username}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                      <span className="flex items-center"><User className="w-4 h-4 mr-1" /> Age: {appt.patient?.age || 'N/A'}</span>
                      <span className="flex items-center"><CalendarIcon className="w-4 h-4 mr-1" /> {appt.date}</span>
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {appt.time}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-sm font-medium text-gray-600">
                    {appt.reason}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border tracking-wide uppercase ${
                    appt.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                    appt.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                    'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {appt.status}
                  </span>
                  
                  {appt.status === 'scheduled' ? (
                     <Link 
                      to={`/doctor/consultation/${appt._id}`}
                      className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-xl hover:bg-teal-700 font-bold text-sm transition-all shadow-sm"
                     >
                       <Play className="w-4 h-4 mr-2" /> Consult
                     </Link>
                  ) : (
                    <button className="flex items-center text-teal-600 hover:text-teal-800 font-medium text-sm transition-colors hover:underline">
                      <FileText className="w-4 h-4 mr-1" />
                      View Note
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <Search className="w-12 h-12 text-gray-200 mb-3" />
              <p className="font-medium text-lg">No appointments found</p>
              <p className="text-sm">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorAppointments
