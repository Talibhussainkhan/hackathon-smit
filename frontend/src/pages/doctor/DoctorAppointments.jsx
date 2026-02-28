import React, { useState } from 'react'
import { Calendar as CalendarIcon, Clock, User, Filter, Search, FileText } from 'lucide-react'

const DoctorAppointments = () => {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const appointments = [
    { id: 101, patient: 'Michael Brown', age: 45, date: '2023-10-25', time: '09:00 AM', status: 'Completed', type: 'Checkup' },
    { id: 102, patient: 'Sarah Davis', age: 28, date: '2023-10-26', time: '09:30 AM', status: 'Upcoming', type: 'Follow-up' },
    { id: 103, patient: 'James Wilson', age: 62, date: '2023-10-26', time: '10:00 AM', status: 'Upcoming', type: 'Consultation' },
    { id: 104, patient: 'Emma Thomas', age: 34, date: '2023-10-25', time: '11:15 AM', status: 'Completed', type: 'Lab Review' },
  ]

  const filteredAppointments = appointments.filter(appt => {
    if (filter !== 'All' && appt.status !== filter) return false
    if (search && !appt.patient.toLowerCase().includes(search.toLowerCase())) return false
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
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
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
        <div className="divide-y divide-gray-50">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt) => (
              <div key={appt.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {appt.patient.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{appt.patient}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                      <span className="flex items-center"><User className="w-4 h-4 mr-1" /> Age: {appt.age}</span>
                      <span className="flex items-center"><CalendarIcon className="w-4 h-4 mr-1" /> {appt.date}</span>
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {appt.time}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-sm font-medium text-gray-600">
                    {appt.type}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    appt.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {appt.status}
                  </span>
                  <button className="flex items-center text-teal-600 hover:text-teal-800 font-medium text-sm transition-colors hover:underline">
                    <FileText className="w-4 h-4 mr-1" />
                    History
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No appointments found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorAppointments
