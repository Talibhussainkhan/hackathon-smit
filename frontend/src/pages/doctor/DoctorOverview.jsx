import React from 'react'
import { CalendarDays, Users, Clock, TrendingUp } from 'lucide-react'

const DoctorOverview = () => {
  const stats = [
    { title: "Today's Appointments", value: '12', icon: CalendarDays, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Total Patients', value: '3,240', icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
    { title: 'Avg. Consultation', value: '18m', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Patient Satisfaction', value: '4.8/5', icon: TrendingUp, color: 'text-pink-600', bg: 'bg-pink-50' },
  ]

  const upcomingAppointments = [
    { id: 1, time: '09:00 AM', patient: 'Michael Brown', type: 'Checkup', status: 'In Progress' },
    { id: 2, time: '09:30 AM', patient: 'Sarah Davis', type: 'Follow-up', status: 'Waiting' },
    { id: 3, time: '10:00 AM', patient: 'James Wilson', type: 'Consultation', status: 'Upcoming' },
  ]

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold border-b border-gray-200 pb-4 text-gray-800 tracking-tight">
          Welcome back, Dr. Smith
        </h1>
        <p className="text-gray-500 mt-2">Here is a summary of your schedule and personal statistics for today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
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
            <h2 className="text-lg font-semibold text-gray-800">Today's Schedule</h2>
            <button className="text-teal-600 text-sm font-medium hover:text-teal-700">View All</button>
          </div>
          <div className="space-y-4">
            {upcomingAppointments.map((appt) => (
              <div key={appt.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="text-center bg-gray-100 px-3 py-2 rounded-lg min-w-[80px]">
                    <span className="block text-sm font-bold text-gray-800">{appt.time.split(' ')[0]}</span>
                    <span className="block text-xs font-medium text-gray-500">{appt.time.split(' ')[1]}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{appt.patient}</h4>
                    <p className="text-sm text-gray-500">{appt.type}</p>
                  </div>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    appt.status === 'In Progress' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                    appt.status === 'Waiting' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {appt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Placeholder */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-teal-300 hover:bg-teal-50 transition-all group">
              <span className="font-medium text-gray-700 group-hover:text-teal-700 block">Start Next Consultation</span>
              <span className="text-sm text-gray-500 block mt-0.5">Michael Brown • 09:00 AM</span>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all group">
              <span className="font-medium text-gray-700 group-hover:text-blue-700 block">Review Lab Results</span>
              <span className="text-sm text-gray-500 block mt-0.5">3 new reports available</span>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-purple-300 hover:bg-purple-50 transition-all group">
              <span className="font-medium text-gray-700 group-hover:text-purple-700 block">Update Availability</span>
              <span className="text-sm text-gray-500 block mt-0.5">Manage next week's slots</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorOverview
