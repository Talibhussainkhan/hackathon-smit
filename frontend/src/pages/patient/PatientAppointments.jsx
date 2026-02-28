import React, { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, Clock, Stethoscope, ChevronRight, Loader2, CalendarX2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const PatientAppointments = () => {
  const [filter, setFilter] = useState('All')
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/patient/my-appointments`, { withCredentials: true })
      setAppointments(data)
    } catch (error) {
      toast.error("Failed to load appointment history")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAppointments = appointments.filter(appt => {
    if (filter === 'All') return true
    if (filter === 'Upcoming') return appt.status === 'scheduled'
    if (filter === 'Completed') return appt.status === 'completed'
    if (filter === 'Cancelled') return appt.status === 'cancelled'
    return true
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-emerald-100 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Appointment History</h1>
          <p className="text-gray-500 mt-1">View your past visits and upcoming schedule.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-emerald-50 flex-1 flex flex-col overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex gap-2 overflow-x-auto">
          {['All', 'Upcoming', 'Completed', 'Cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                filter === status 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* List View */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="relative border-l-2 border-emerald-100 ml-3 space-y-8">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appt) => (
                <div key={appt._id} className="relative pl-8">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[9px] top-6 w-4 h-4 rounded-full border-4 border-white shadow-sm ${
                    appt.status === 'scheduled' ? 'bg-blue-500' : 
                    appt.status === 'completed' ? 'bg-emerald-500' : 'bg-red-400'
                  }`}></div>
                  
                  {/* Card Main content */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-emerald-200 hover:shadow-md transition-all group group-hover:bg-emerald-50/30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      {/* Left: Date/Time */}
                      <div className="flex flex-col bg-gray-50 p-3 rounded-xl min-w-[120px] text-center border border-gray-100 group-hover:bg-white group-hover:border-emerald-100 transition-colors">
                        <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">
                           {new Date(appt.date).toLocaleString('default', { month: 'short' })} • {new Date(appt.date).getFullYear()}
                        </span>
                        <span className="text-3xl font-extrabold text-gray-800 my-1">{new Date(appt.date).getDate()}</span>
                        <span className="text-xs font-semibold text-gray-500 flex items-center justify-center">
                          <Clock className="w-3 h-3 mr-1" /> {appt.time}
                        </span>
                      </div>

                      {/* Middle: Doctor Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            appt.status === 'scheduled' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                            appt.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                            'bg-red-100 text-red-700 border border-red-200'
                          }`}>
                            {appt.status}
                          </span>
                          <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">{appt.reason}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">Dr. {appt.doctor?.username}</h3>
                        <p className="text-sm font-medium text-gray-500 flex items-center mt-1">
                          <Stethoscope className="w-4 h-4 mr-1.5 text-gray-400" />
                          Consultation Visit
                        </p>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center justify-end w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-gray-100 md:border-0 pl-0 md:pl-6">
                        {appt.status === 'completed' && (
                           <div className="text-emerald-600 font-bold text-xs flex items-center bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                             Checked Out <ChevronRight className="w-4 h-4 ml-1" />
                           </div>
                        )}
                        {appt.status === 'scheduled' && (
                           <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">Confirmed Booking</span>
                        )}
                        {appt.status === 'cancelled' && (
                           <span className="text-xs font-bold text-red-400">Booking Revoked</span>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="pl-8 py-10">
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-500">
                  <CalendarX2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-bold text-lg text-gray-600">No appointments found</p>
                  <p className="text-sm mt-1">Try adjusting your filters to see more results.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientAppointments
