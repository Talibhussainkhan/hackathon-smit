import React from 'react'
import { Users, Clock, CalendarCheck, AlertCircle, CheckCircle2 } from 'lucide-react'

const ReceptionistOverview = () => {
  const stats = [
    { title: "Today's Total Patients", value: '42', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Waiting Room', value: '5', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Completed Visits', value: '18', icon: CalendarCheck, color: 'text-teal-600', bg: 'bg-teal-50' },
    { title: 'No Shows / Cancelled', value: '2', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ]

  const waitingList = [
    { id: 1, patient: 'Emma Thomas', time: '10:15 AM', doctor: 'Dr. Sarah Smith', status: 'Waiting', waitTime: '15 mins' },
    { id: 2, patient: 'Oliver Martinez', time: '10:30 AM', doctor: 'Dr. John Doe', status: 'Next', waitTime: '5 mins' },
    { id: 3, patient: 'Sophia Anderson', time: '10:45 AM', doctor: 'Dr. Sarah Smith', status: 'Just Arrived', waitTime: '0 mins' },
  ]

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold border-b border-rose-100 pb-4 text-gray-800 tracking-tight">
          Front Desk Overview
        </h1>
        <p className="text-gray-500 mt-2">Manage clinic flow and track patient arrivals for today.</p>
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
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-rose-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-rose-500" />
              Live Waiting Room
            </h2>
            <button className="text-sm font-medium bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors">
              Refresh
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
                  <th className="px-4 py-3 font-semibold text-xs tracking-wider uppercase">Patient</th>
                  <th className="px-4 py-3 font-semibold text-xs tracking-wider uppercase">Appt Time</th>
                  <th className="px-4 py-3 font-semibold text-xs tracking-wider uppercase">Doctor</th>
                  <th className="px-4 py-3 font-semibold text-xs tracking-wider uppercase">Wait Time</th>
                  <th className="px-4 py-3 text-right font-semibold text-xs tracking-wider uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {waitingList.map((item) => (
                  <tr key={item.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="px-4 py-4 font-bold text-gray-900">{item.patient}</td>
                    <td className="px-4 py-4 text-gray-600 text-sm">{item.time}</td>
                    <td className="px-4 py-4 text-gray-600 text-sm">{item.doctor}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        item.waitTime.includes('15') ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {item.waitTime}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="flex items-center justify-end w-full text-teal-600 hover:text-teal-800 font-semibold text-sm transition-colors group">
                        <CheckCircle2 className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                        Send In
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Placeholder */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Quick Front Desk Actions</h2>
          <div className="space-y-4 pt-2">
            <button className="w-full relative overflow-hidden group bg-gradient-to-br from-rose-500 to-pink-600 text-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-left">
              <div className="relative z-10">
                <span className="font-bold block text-lg">Register Walk-In</span>
                <span className="text-rose-100 text-xs mt-1 block">Quick add a new patient to today's queue</span>
              </div>
              <div className="absolute right-0 bottom-0 text-white/20 transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform duration-500">
                <Users className="w-24 h-24" />
              </div>
            </button>
            
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-2">Upcoming Arrivals (Next 30m)</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex justify-between items-center py-1 border-b border-gray-200/50 border-dotted">
                  <span>William Chen</span>
                  <span className="font-medium text-gray-800">11:00 AM</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-gray-200/50 border-dotted">
                  <span>Mia Johnson</span>
                  <span className="font-medium text-gray-800">11:15 AM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReceptionistOverview
