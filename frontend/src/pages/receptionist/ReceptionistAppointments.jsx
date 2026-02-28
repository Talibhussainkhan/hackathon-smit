import React, { useState } from 'react'
import { CalendarPlus, Search, Clock, User, Filter, X } from 'lucide-react'

const ReceptionistAppointments = () => {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    patientName: '', doctorId: '', date: '', time: '', type: 'Consultation'
  })

  // Placeholder data
  const appointments = [
    { id: '501', patient: 'Emma Thomas', date: '2023-10-25', time: '10:15 AM', doctor: 'Dr. Sarah Smith', status: 'Upcoming', type: 'Checkup' },
    { id: '502', patient: 'Oliver Martinez', date: '2023-10-25', time: '10:30 AM', doctor: 'Dr. John Doe', status: 'Upcoming', type: 'Consultation' },
    { id: '503', patient: 'Sophia Anderson', date: '2023-10-25', time: '10:45 AM', doctor: 'Dr. Sarah Smith', status: 'Completed', type: 'Follow-up' },
    { id: '504', patient: 'William Chen', date: '2023-10-26', time: '09:00 AM', doctor: 'Dr. Emily Chen', status: 'Cancelled', type: 'Lab Review' },
  ]

  const filteredAppointments = appointments.filter(appt => {
    if (filter !== 'All' && appt.status !== filter) return false
    if (search && !(appt.patient.toLowerCase().includes(search.toLowerCase()) || appt.doctor.toLowerCase().includes(search.toLowerCase()))) return false
    return true
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Booked New Appointment:', formData)
    // TODO: Add API call here
    setIsModalOpen(false)
    setFormData({ patientName: '', doctorId: '', date: '', time: '', type: 'Consultation' })
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
              <option value="Upcoming">Upcoming</option>
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
          <div className="divide-y divide-gray-50">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appt) => (
                <div key={appt.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-rose-50/30 transition-colors border border-transparent hover:border-rose-100 rounded-xl m-2">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex flex-col items-center justify-center border border-rose-100 flex-shrink-0">
                      <span className="text-xs font-bold leading-none">{appt.date.split('-')[1]}</span>
                      <span className="text-lg font-extrabold leading-none mt-0.5">{appt.date.split('-')[2]}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{appt.patient}</h3>
                      <div className="flex items-center text-sm font-medium text-gray-500 mt-1 space-x-3">
                        <span className="flex items-center text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md"><User className="w-3.5 h-3.5 mr-1" /> {appt.doctor}</span>
                        <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-gray-400" /> {appt.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-sm font-semibold text-gray-600">
                      {appt.type}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${
                      appt.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                      appt.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
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
                  <label className="text-sm font-bold text-gray-700">Patient Name <span className="text-red-500">*</span></label>
                  <input type="text" name="patientName" required value={formData.patientName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all" placeholder="Patient's Full Name" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">Select Doctor <span className="text-red-500">*</span></label>
                  <select name="doctorId" required value={formData.doctorId} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all text-gray-600">
                    <option value="">Choose a doctor...</option>
                    <option value="1">Dr. Sarah Smith (Cardiology)</option>
                    <option value="2">Dr. John Doe (Pediatrics)</option>
                    <option value="3">Dr. Emily Chen (Dermatology)</option>
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
                  <label className="text-sm font-bold text-gray-700">Appointment Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all text-gray-600">
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Checkup">Checkup</option>
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
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold hover:from-rose-600 hover:to-pink-700 rounded-xl shadow-md transition-all flex items-center tracking-wide"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReceptionistAppointments
