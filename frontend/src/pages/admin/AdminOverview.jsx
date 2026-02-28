import React, { useEffect, useState } from 'react'
import { Users, UserRoundCog, Activity, CalendarDays } from 'lucide-react'
import axios from 'axios'
import { 
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer
} from 'recharts'

const AdminOverview = () => {
  const [stats, setStats] = useState([
    { title: 'Total Doctors', value: '0', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', key: 'doctors' },
    { title: 'Receptionists', value: '0', icon: UserRoundCog, color: 'text-purple-600', bg: 'bg-purple-50', key: 'receptionists' },
    { title: 'Total Users', value: '0', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50', key: 'total' },
  ])
  const [isLoading, setIsLoading] = useState(true)

  // Mock usage data for the chart

  const pieData = stats
    .filter(s => s.key !== 'total')
    .map(s => ({ name: s.title, value: parseInt(s.value) || 0 }))

  const COLORS = ['#2563eb', '#9333ea']

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/analytics`, { withCredentials: true })
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* User Distribution Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">User Distribution</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{entry.name}</span>
                <span className="font-bold text-gray-800">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOverview
