import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, MoreVertical, X } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AdminDoctors = () => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/doctors`)
      // data should be an array of doctor objects
      setDoctors(Array.isArray(data) ? data : []);
      console.log("Fetched Doctors:", data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to load doctors");
    }
  }

  useEffect(() => {
    fetchDoctors();
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/doctors`, formData)
      toast.success(data.message || "Doctor added successfully")
      setIsModalOpen(false)
      setFormData({ username: '', email: '', password: '' })
      fetchDoctors();      
    } catch (error) {
      toast.error(error.response?.data?.error || "Error adding doctor")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      const { data } = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/doctors/${id}`)
      toast.success(data.message || "Doctor deleted")
      fetchDoctors()
    } catch (error) {
      toast.error(error.response?.data?.error || "Error deleting doctor")
    }
  }

  const filteredDoctors = doctors.filter(doc => 
    (doc.username || "").toLowerCase().includes(search.toLowerCase()) || 
    (doc.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Manage Doctors</h1>
          <p className="text-gray-500 mt-1">View, add, edit, or remove doctors across the platform.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center shadow-sm shadow-blue-200 transition-all font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Doctor
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-sm">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="mt-4 md:mt-0 px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium text-xs border border-blue-100">
            Total Doctors: {doctors.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">Username</th>
                <th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">Email</th>
                <th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">Role</th>
                <th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">Last Updated</th>
                <th className="px-6 py-4 text-right font-semibold text-xs tracking-wider uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <tr key={doctor._id || doctor.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{doctor.username || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{doctor.email || "N/A"}</td>
                    <td className="px-6 py-4 uppercase text-xs font-semibold">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100">
                        {doctor.role || "doctor"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {doctor.updatedAt ? new Date(doctor.updatedAt).toLocaleDateString() : (doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString() : 'N/A')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(doctor._id || doctor.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors cursor-not-allowed">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                    No doctors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Add New Doctor</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="add-doctor-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Username *</label>
                    <input type="text" name="username" required value={formData.username} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Asad Awan" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Email *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="asad@dr.com" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Password *</label>
                    <input type="password" name="password" required value={formData.password} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="••••••••" />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="add-doctor-form"
                className="px-5 py-2.5 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Adding Doctor..." : "Save Doctor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDoctors
