import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit2, UserPlus, Phone, Mail, MapPin, X, Loader2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const ReceptionistPatients = () => {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [patients, setPatients] = useState([])
  
  const [formData, setFormData] = useState({
    username: '', 
    email: '', 
    phone: '', 
    age: '', 
    password: 'password123' // default for registered patients
  })

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/receptionist/patients`, { withCredentials: true })
      setPatients(data)
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching patients")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (isEditMode) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/receptionist/update-patient/${selectedPatientId}`, formData, { withCredentials: true })
        toast.success("Patient updated successfully")
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/receptionist/register-patient`, formData, { withCredentials: true })
        toast.success("Patient registered successfully")
      }
      setIsModalOpen(false)
      fetchPatients()
      resetForm()
    } catch (error) {
      toast.error(error.response?.data?.error || "Operation failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditClick = (patient) => {
    setSelectedPatientId(patient._id)
    setFormData({
      username: patient.username,
      email: patient.email,
      phone: patient.phone || '',
      age: patient.age || '',
    })
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({ username: '', email: '', phone: '', age: '', password: 'password123' })
    setIsEditMode(false)
    setSelectedPatientId(null)
  }

  const filteredPatients = patients.filter(p => 
    p.username?.toLowerCase().includes(search.toLowerCase()) || 
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search)
  )

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-rose-100 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Patient Directory</h1>
          <p className="text-gray-500 mt-1">Register new patients and update existing records.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
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
              placeholder="Search by name, phone, or email..."
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
          {isLoading ? (
             <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p>Fetching patients...</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredPatients.map((patient) => (
                <div key={patient._id} className="border border-gray-100 rounded-2xl p-5 hover:border-rose-200 hover:shadow-md transition-all group bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg group-hover:from-rose-100 group-hover:to-pink-100 group-hover:text-rose-600 transition-colors">
                        {patient.username?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-rose-600 transition-colors">{patient.username}</h3>
                        <p className="text-xs font-semibold text-gray-400 tracking-wider">Age: {patient.age || 'N/A'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleEditClick(patient)}
                      className="text-gray-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2 mt-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-gray-400 group-hover:text-rose-400 transition-colors" /> {patient.phone || 'No phone'}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-gray-400 group-hover:text-rose-400 transition-colors" /> {patient.email}
                    </div>
                    <div className="flex items-center text-gray-600 pt-3 border-t border-gray-50 mt-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-20">Joined:</span> 
                      <span className="font-medium text-gray-800">
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-white">
              <div className="flex items-center space-x-3">
                <div className="bg-rose-500 text-white p-2 rounded-xl shadow-sm">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{isEditMode ? 'Edit Patient Information' : 'Patient Registration'}</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="register-patient-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 flex items-center">Full Name <span className="text-red-500 ml-1">*</span></label>
                  <input type="text" name="username" required value={formData.username} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all" placeholder="John Doe" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700 flex items-center"><Phone className="w-4 h-4 mr-1.5 text-gray-400"/> Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all" placeholder="+1..." />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all" placeholder="25" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 flex items-center"><Mail className="w-4 h-4 mr-1.5 text-gray-400"/> Email Address <span className="text-red-500 ml-1">*</span></label>
                  <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all" placeholder="patient@example.com" />
                </div>

                { !isEditMode && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Set Initial Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all" />
                    <p className="text-[10px] text-gray-400">Default password is 'password123'</p>
                  </div>
                )}
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
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold hover:from-rose-600 hover:to-pink-700 rounded-xl shadow-md transition-all flex items-center tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  isEditMode ? 'Update Record' : 'Complete Registration'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReceptionistPatients
