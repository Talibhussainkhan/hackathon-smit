import React from 'react'
import { Activity, Heart, Scale, CalendarClock, User, Phone, MapPin } from 'lucide-react'

const PatientOverview = () => {
  const patientData = {
    name: 'Michael Brown',
    age: 45,
    bloodType: 'O+',
    height: "5'11\"",
    weight: '175 lbs',
    phone: '+1 (555) 123-4567',
    email: 'michael.b@example.com',
    address: '123 Health Ave, Wellness City',
  }

  const healthVitals = [
    { title: 'Blood Type', value: patientData.bloodType, icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
    { title: 'Height', value: patientData.height, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Weight', value: patientData.weight, icon: Scale, color: 'text-orange-500', bg: 'bg-orange-50' },
  ]

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold border-b border-emerald-100 pb-4 text-gray-800 tracking-tight">
          Welcome back, {patientData.name.split(' ')[0]}
        </h1>
        <p className="text-gray-500 mt-2">Here is a quick overview of your health profile and upcoming schedule.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-emerald-50 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-emerald-600 font-bold text-4xl shadow-sm mb-4">
            {patientData.name.charAt(0)}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{patientData.name}</h2>
          <p className="text-gray-500 text-sm font-medium mb-6">Patient ID: #1001 • Age: {patientData.age}</p>
          
          <div className="w-full space-y-4 text-left border-t border-gray-100 pt-6">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-3 text-emerald-500" /> {patientData.phone}
            </div>
            <div className="flex items-center text-sm text-gray-600 border-t border-gray-50 pt-4">
              <User className="w-4 h-4 mr-3 text-emerald-500" /> {patientData.email}
            </div>
            <div className="flex items-center text-sm text-gray-600 border-t border-gray-50 pt-4">
              <MapPin className="w-4 h-4 mr-3 text-emerald-500 flex-shrink-0" /> {patientData.address}
            </div>
          </div>
        </div>

        {/* Vitals & Upcoming */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Health Summary */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-50">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Health Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {healthVitals.map((vital, index) => {
                const Icon = vital.icon
                return (
                  <div key={index} className={`${vital.bg} border border-white p-4 rounded-2xl flex items-center space-x-4 shadow-sm`}>
                    <div className="bg-white p-2 rounded-xl shadow-sm">
                      <Icon className={`w-6 h-6 ${vital.color}`} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{vital.title}</p>
                      <p className={`text-xl font-extrabold ${vital.color}`}>{vital.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Upcoming Appointment */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 shadow-md text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 text-white/10 transform translate-x-4 -translate-y-4">
              <CalendarClock className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <p className="text-emerald-100 font-medium mb-1 tracking-wide uppercase text-sm">Next Appointment</p>
                <h3 className="text-2xl font-bold mb-2">Tomorrow • 09:00 AM</h3>
                <p className="text-emerald-50 text-sm flex items-center mb-1">
                  <User className="w-4 h-4 mr-1 pb-0.5" /> Dr. Sarah Smith (Cardiology)
                </p>
                <p className="text-emerald-50 text-sm opacity-80">Reason: Routine Checkup</p>
              </div>
              <button className="mt-6 md:mt-0 bg-white text-emerald-600 hover:bg-emerald-50 px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors text-sm">
                Reschedule
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PatientOverview
