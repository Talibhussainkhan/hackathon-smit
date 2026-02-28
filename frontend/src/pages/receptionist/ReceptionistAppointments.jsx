import React, { useState, useEffect } from 'react'
import { CalendarPlus, Search, Clock, User, Filter, X, Loader2, CheckCircle2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const ReceptionistAppointments = () => {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  
  const [formData, setFormData] = useState({
    patientId: '', doctorId: '', date: new Date().toISOString().split('T')[0], time: '', reason: 'General Consultation'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [apptsRes, docsRes, patientsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/receptionist/schedule`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/receptionist/doctors`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/receptionist/patients`, { withCredentials: true })
      ])
      setAppointments(apptsRes.data)
      setDoctors(docsRes.data)
      setPatients(patientsRes.data)
    } catch (error) {
      toast.error("Error loading appointment data")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAppointments = appointments.filter(appt => {
    const patientName = appt.patient?.username?.toLowerCase() || ''
    const doctorName = appt.doctor?.username?.toLowerCase() || ''
    
    if (filter !== 'All' && appt.status !== filter.toLowerCase()) return false
    if (search && !(patientName.includes(search.toLowerCase()) || doctorName.includes(search.toLowerCase()))) return false
    return true
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/receptionist/book-appointment`, formData, { withCredentials: true })
      toast.success("Appointment booked successfully")
      setIsModalOpen(false)
      fetchData()
      setFormData({ patientId: '', doctorId: '', date: new Date().toISOString().split('T')[0], time: '', reason: 'General Consultation' })
    } catch (error) {
      toast.error(error.response?.data?.error || "Booking failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-rose-100 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Appointments Management</h1>
          <p className="text-gray-500 mt-1">Book new appointments and view the clinic schedule.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-5 py-2.5 rounded-xl flex items-center shadow-md shadow-rose-200 transition-all font-bold tracking-wide"
        >
          <CalendarPlus className="w-5 h-5 mr-2" />
          Book Appointment
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-rose-50 flex-1 flex flex-col min-h-0">
        {/* Filters & Search */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center bg-gray-50/50 gap-4">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 block p-2 outline-none w-full md:w-48"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Scheduled">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient or doctor..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* List View */}
        <div className="overflow-auto flex-1 p-2">
           {isLoading ? (
             <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p>Loading schedule...</p>
             </div>
           ) : (
            <div className="divide-y divide-gray-50">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt) => (
                  <div key={appt._id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-rose-50/30 transition-colors border border-transparent hover:border-rose-100 rounded-xl m-2">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex flex-col items-center justify-center border border-rose-100 flex-shrink-0">
                        <span className="text-xs font-bold leading-none">{appt.date?.split('-')[1]}</span>
                        <span className="text-lg font-extrabold leading-none mt-0.5">{appt.date?.split('-')[2]}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{appt.patient?.username}</h3>
                        <div className="flex items-center text-sm font-medium text-gray-500 mt-1 space-x-3">
                          <span className="flex items-center text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md"><User className="w-3.5 h-3.5 mr-1" /> {appt.doctor?.username}</span>
                          <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-gray-400" /> {appt.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-sm font-semibold text-gray-600">
                        {appt.reason}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${
                        appt.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                        appt.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {appt.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center flex flex-col items-center justify-center h-full text-gray-400">
                  <CalendarPlus className="w-12 h-12 mb-3 text-gray-300" />
                  <p className="font-medium">No appointments found matching your criteria.</p>
                </div>
              )}
            </div>
           )}
        </div>
      </div>

      {/* Book Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-white">
              <div className="flex items-center space-x-3">
                <div className="bg-rose-500 text-white p-2 text-sm rounded-xl shadow-sm">
                  <CalendarPlus className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Book Appointment</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="book-appt-form" onSubmit={handleSubmit} className="space-y-5">
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">Select Patient <span className="text-red-500">*</span></label>
                  <select name="patientId" required value={formData.patientId} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all text-gray-600">
                    <option value="">Choose a patient...</option>
                    {patients.map(p => (
                      <option key={p._id} value={p._id}>{p.username}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">Select Doctor <span className="text-red-500">*</span></label>
                  <select name="doctorId" required value={formData.doctorId} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all text-gray-600">
                    <option value="">Choose a doctor...</option>
                    {doctors.map(d => (
                      <option key={d._id} value={d._id}>{d.username}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Date <span className="text-red-500">*</span></label>
                    <input type="date" name="date" required value={formData.date} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all text-gray-600" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Time <span className="text-red-500">*</span></label>
                    <input type="time" name="time" required value={formData.time} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all text-gray-600" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">Reason / Type</label>
                  <select name="reason" value={formData.reason} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all text-gray-600">
                    <option value="General Consultation">General Consultation</option>
                    <option value="Follow-up Visit">Follow-up Visit</option>
                    <option value="Annual Checkup">Annual Checkup</option>
                    <option value="Lab Review">Lab Review</option>
                  </select>
                </div>

              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="book-appt-form"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold hover:from-rose-600 hover:to-pink-700 rounded-xl shadow-md transition-all flex items-center tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Book Now'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReceptionistAppointments
