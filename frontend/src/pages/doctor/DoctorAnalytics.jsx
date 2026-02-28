import React, { useState, useEffect } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts'
import { Users, Calendar, CheckCircle, TrendingUp, Filter, Download, Loader2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const DoctorAnalytics = () => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/doctor/stats`, { withCredentials: true })
      setData(data)
    } catch (error) {
      toast.error("Failed to load analytics")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
    </div>
  )

  const statsCards = [
    { title: 'Total Patients', value: data?.stats.totalAppointments || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: "Today's Appts", value: data?.stats.todayAppointments || 0, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Completed Px', value: data?.stats.totalCompleted || 0, icon: CheckCircle, color: 'text-teal-600', bg: 'bg-teal-50' },
    { title: 'Success Rate', value: data?.stats.totalAppointments ? `${Math.round((data.stats.totalCompleted / data.stats.totalAppointments) * 100)}%` : '0%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  const COLORS = ['#0d9488', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Personal Analytics</h1>
          <p className="text-gray-500 mt-1">Deep dive into your clinical performance and patient trends.</p>
        </div>
        <div className="flex items-center space-x-3">
           <div className="flex bg-gray-100 p-1 rounded-xl">
             {['7d', '30d', 'all'].map(range => (
               <button 
                 key={range}
                 onClick={() => setTimeRange(range)}
                 className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === range ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 {range.toUpperCase()}
               </button>
             ))}
           </div>
           <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 shadow-sm transition-all">
             <Download className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-gray-800">Weekly Patient Load</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-xs text-gray-500"><span className="w-3 h-3 bg-teal-500 rounded-full mr-2"></span>Completed</div>
              <div className="flex items-center text-xs text-gray-500"><span className="w-3 h-3 bg-indigo-200 rounded-full mr-2"></span>Total</div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.chartData}>
                <defs>
                  <linearGradient id="colorAppt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#0d9488', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area type="monotone" dataKey="appointments" stroke="#6366f1" strokeWidth={3} fill="transparent" />
                <Area type="monotone" dataKey="completed" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorAppt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Diagnosis Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-sm">
           <h3 className="font-bold text-gray-800 mb-8">Diagnosis Mix</h3>
           <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.diagnosisMix || []}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {(data?.diagnosisMix || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Main</p>
                 <p className="text-xl font-bold text-gray-800 truncate max-w-[100px]">
                   {data?.diagnosisMix?.[0]?.name || 'N/A'}
                 </p>
              </div>
           </div>
           <div className="mt-8 space-y-3">
              {(data?.diagnosisMix || []).map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                   <div className="flex items-center">
                     <div className={`w-2 h-2 rounded-full mr-2`} style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                     <span className="text-gray-600 truncate max-w-[120px]">{item.name}</span>
                   </div>
                   <span className="font-bold text-gray-900">{item.value}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Recent Success Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
           <h3 className="font-bold text-gray-800">Recent Patients Treated</h3>
           <button className="text-teal-600 text-xs font-bold hover:underline">Download Report</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Patient</th>
                <th className="px-8 py-4">Age / Contact</th>
                <th className="px-8 py-4">Last Visit</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.recentPatients.map((px) => (
                <tr key={px._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-4">
                     <div className="font-bold text-gray-900">{px.patient?.username}</div>
                     <div className="text-[10px] text-teal-600 font-medium">#{px._id.slice(-6)}</div>
                  </td>
                  <td className="px-8 py-4">
                     <div className="text-sm text-gray-600 font-medium">{px.patient?.age} yrs</div>
                     <div className="text-xs text-gray-400">{px.patient?.phone}</div>
                  </td>
                  <td className="px-8 py-4 text-sm text-gray-500">
                     {new Date(px.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-4">
                     <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold border border-green-100 uppercase">
                       Prescribed
                     </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DoctorAnalytics
