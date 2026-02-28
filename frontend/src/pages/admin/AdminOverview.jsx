import React, { useEffect, useState } from 'react'
import { Users, UserRoundCog, Activity, CalendarDays } from 'lucide-react'
import axios from 'axios'

const AdminOverview = () => {
  const [stats, setStats] = useState([
    { title: 'Total Doctors', value: '0', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', key: 'doctors' },
    { title: 'Receptionists', value: '0', icon: UserRoundCog, color: 'text-purple-600', bg: 'bg-purple-50', key: 'receptionists' },
    { title: 'Patients', value: '0', icon: Activity, color: 'text-green-600', bg: 'bg-green-50', key: 'patients' },
    { title: 'Total Users', value: '0', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50', key: 'total' },
  ])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/analytics`)
        setStats(prev => prev.map(stat => ({
          ...stat,
          value: data.users[stat.key].toString()
        })))
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold border-b border-gray-200 pb-4 text-gray-800 tracking-tight">
          System Overview
        </h1>
        <p className="text-gray-500 mt-2">Monitor analytics and platform usage across all clinics.</p>
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
                  <h3 className="text-3xl font-bold text-gray-900">
                    {isLoading ? '...' : stat.value}
                  </h3>
                </div>
                <div className={`${stat.bg} p-4 rounded-xl`}>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts / Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Platform Usage Over Time</h2>
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-200">
            <span className="text-gray-400 font-medium tracking-wide">Usage Chart Placeholder</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-start space-x-3 py-3 border-b border-gray-50 last:border-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">New User Registered</p>
                  <p className="text-xs text-gray-500">Just now • Patient Account</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOverview
