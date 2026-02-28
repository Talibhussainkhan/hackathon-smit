import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, X, MoreVertical, Loader2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AdminReceptionists = () => {
  const [search, setSearch] = useState('')
  const [receptionists, setReceptionists] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  const [selectedReceptionist, setSelectedReceptionist] = useState(null)
  const [editFormData, setEditFormData] = useState({
    username: '',
    email: '',
  })

  const fetchReceptionists = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/receptionists`, { withCredentials: true })
      setReceptionists(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching receptionists:', error)
      toast.error("Failed to load receptionists")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReceptionists()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/receptionists`, formData, { withCredentials: true })
      toast.success(data.message)
      setIsModalOpen(false)
      setFormData({ username: '', email: '', password: '' })
      fetchReceptionists()
    } catch (error) {
      toast.error(error.response?.data?.error || "Error adding receptionist")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = async (id) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/receptionists/${id}`, { withCredentials: true })
      setSelectedReceptionist(data)
      setEditFormData({
        username: data.username,
        email: data.email,
      })
      setIsEditModalOpen(true)
    } catch (error) {
      toast.error("Failed to fetch receptionist details")
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/receptionists/${selectedReceptionist._id}`, editFormData, { withCredentials: true })
      toast.success("Receptionist updated successfully")
      setIsEditModalOpen(false)
      fetchReceptionists()
    } catch (error) {
      toast.error(error.response?.data?.error || "Error updating receptionist")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/receptionists/${id}`, { withCredentials: true })
      toast.success(data.message)
      fetchReceptionists()
    } catch (error) {
      toast.error(error.response?.data?.error || "Error deleting receptionist")
    }
  }

  const filteredReceptionists = receptionists.filter(
    (recp) =>
      (recp.username || "").toLowerCase().includes(search.toLowerCase()) ||
      (recp.email || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Manage Receptionists</h1>
          <p className="text-gray-500 mt-1">Oversee front-desk staff across all clinics.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl flex items-center shadow-sm shadow-purple-200 transition-all font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Receptionist
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-sm">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search receptionists..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="mt-4 md:mt-0 px-2 py-1 bg-purple-50 text-purple-700 rounded-md font-medium text-xs border border-purple-100">
            Total Receptionists: {receptionists.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">Username</th>
                <th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">Email</th>
                <th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">Role</th>
                <th className="px-6 py-4 font-semibold text-xs tracking-wider uppercase">Joined Date</th>
                <th className="px-6 py-4 text-right font-semibold text-xs tracking-wider uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                      <p className="text-sm font-medium">Fetching receptionists...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredReceptionists.length > 0 ? (
                filteredReceptionists.map((recp) => (
                  <tr key={recp._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{recp.username}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{recp.email}</td>
                    <td className="px-6 py-4">
                      <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md border border-purple-100 text-xs uppercase font-semibold">
                        {recp.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(recp.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleEditClick(recp._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(recp._id)}
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
                    No receptionists found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Add New Receptionist</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="add-receptionist-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Username *</label>
                    <input 
                      type="text" 
                      name="username" 
                      required 
                      value={formData.username} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" 
                      placeholder="Jane Doe" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Email *</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" 
                      placeholder="receptionist@clinic.com" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Password *</label>
                    <input 
                      type="password" 
                      name="password" 
                      required 
                      value={formData.password} 
                      onChange={handleInputChange} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" 
                      placeholder="••••••••" 
                    />
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
                form="add-receptionist-form"
                className="px-5 py-2.5 bg-purple-600 text-white font-medium hover:bg-purple-700 rounded-xl shadow-sm transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Save Receptionist"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Edit Receptionist Details</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="edit-receptionist-form" onSubmit={handleUpdate} className="space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Username *</label>
                    <input 
                      type="text" 
                      name="username" 
                      required 
                      value={editFormData.username} 
                      onChange={handleEditInputChange} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Email *</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      value={editFormData.email} 
                      onChange={handleEditInputChange} 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all" 
                    />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="edit-receptionist-form"
                className="px-5 py-2.5 bg-purple-600 text-white font-medium hover:bg-purple-700 rounded-xl shadow-sm transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminReceptionists
