import React, { useState } from 'react'
import { Plus, Search, Edit2, UserPlus, Phone, Mail, MapPin, X } from 'lucide-react'

const ReceptionistPatients = () => {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', dob: '', address: '', gender: ''
  })

  // Placeholder data
  const patients = [
    { id: '1001', name: 'Emma Thomas', email: 'emma.t@example.com', phone: '+1 (555) 123-4567', lastVisit: '2023-10-25' },
    { id: '1002', name: 'Oliver Martinez', email: 'oliver.m@example.com', phone: '+1 (555) 987-6543', lastVisit: '2023-10-10' },
    { id: '1003', name: 'Sophia Anderson', email: 'sophia.a@example.com', phone: '+1 (555) 456-7890', lastVisit: '2023-11-01' },
    { id: '1004', name: 'William Chen', email: 'will.chen@example.com', phone: '+1 (555) 789-0123', lastVisit: 'First Visit' },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Registered New Patient:', formData)
    // TODO: Add API call here
    setIsModalOpen(false)
    setFormData({ firstName: '', lastName: '', email: '', phone: '', dob: '', address: '', gender: '' })
  }

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-rose-100 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Patient Directory</h1>
          <p className="text-gray-500 mt-1">Register new patients and update existing records.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-5 py-2.5 rounded-xl flex items-center shadow-md shadow-rose-200 transition-all font-bold tracking-wide"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Register New Patient
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-rose-50 flex-1 flex flex-col min-h-0">
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, phone, or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-none transition-all text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="mt-4 md:mt-0 text-sm font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
            Total Patients: {patients.length}
          </div>
        </div>

        <div className="overflow-auto flex-1 p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {patients.map((patient) => (
              <div key={patient.id} className="border border-gray-100 rounded-2xl p-5 hover:border-rose-200 hover:shadow-md transition-all group bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg group-hover:from-rose-100 group-hover:to-pink-100 group-hover:text-rose-600 transition-colors">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-rose-600 transition-colors">{patient.name}</h3>
                      <p className="text-xs font-semibold text-gray-400 tracking-wider">ID: #{patient.id}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2 mt-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400 group-hover:text-rose-400 transition-colors" /> {patient.phone}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400 group-hover:text-rose-400 transition-colors" /> {patient.email}
                  </div>
                  <div className="flex items-center text-gray-600 pt-3 border-t border-gray-50 mt-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-20">Last Visit:</span> 
                    <span className={`font-medium ${patient.lastVisit === 'First Visit' ? 'text-teal-600 bg-teal-50 px-2 py-0.5 rounded' : 'text-gray-800'}`}>
                      {patient.lastVisit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Register Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-white">
              <div className="flex items-center space-x-3">
                <div className="bg-rose-500 text-white p-2 rounded-xl shadow-sm">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Patient Registration</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="register-patient-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-1.5 border-b border-gray-100 pb-2 md:border-0 md:pb-0 md:col-span-2 grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700 flex items-center">First Name <span className="text-red-500 ml-1">*</span></label>
                      <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all" placeholder="John" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-700 flex items-center">Last Name <span className="text-red-500 ml-1">*</span></label>
                      <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all" placeholder="Doe" />
                    </div>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 flex items-center"><Phone className="w-4 h-4 mr-1.5 text-gray-400"/> Phone Number <span className="text-red-500 ml-1">*</span></label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 flex items-center"><Mail className="w-4 h-4 mr-1.5 text-gray-400"/> Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all" placeholder="patient@example.com" />
                  </div>

                  {/* Demographics */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Date of Birth <span className="text-red-500 ml-1">*</span></label>
                    <input type="date" name="dob" required value={formData.dob} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all text-gray-600" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Sex / Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all text-gray-600">
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 md:col-span-2 pt-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center"><MapPin className="w-4 h-4 mr-1.5 text-gray-400"/> Primary Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all" placeholder="123 Main St, Apt 4B, City, State, ZIP" />
                  </div>
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
                form="register-patient-form"
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold hover:from-rose-600 hover:to-pink-700 rounded-xl shadow-md transition-all flex items-center tracking-wide"
              >
                Complete Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReceptionistPatients
