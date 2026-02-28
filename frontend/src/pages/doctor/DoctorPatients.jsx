import React, { useState } from 'react'
import { Search, User, Phone, Mail, Calendar, MapPin, History, FileText, Loader2, ArrowRight } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const DoctorPatients = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patientHistory, setPatientHistory] = useState(null)
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)

  const handleSearch = async (e) => {
    if (e) e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/doctor/search-patients?query=${query}`, { withCredentials: true })
      setResults(data)
      if (data.length === 0) toast.error("No patients found")
    } catch (error) {
      toast.error("Search failed")
    } finally {
      setIsLoading(false)
    }
  }

  const selectPatient = async (patient) => {
    setSelectedPatient(patient)
    setIsHistoryLoading(true)
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/doctor/patient-history/${patient._id}`, { withCredentials: true })
      setPatientHistory(data)
    } catch (error) {
      toast.error("Failed to load history")
    } finally {
      setIsHistoryLoading(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 animate-in fade-in duration-500">
      {/* Search Sidebar */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm shrink-0">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Search Patients</h2>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text" 
              placeholder="Name, Phone, or ID..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm"
            />
          </form>
        </div>

        <div className="bg-white flex-1 rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-4 bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {results.length} Search Results
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {isLoading ? (
               <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                 <Loader2 className="w-8 h-8 animate-spin mb-2" />
                 <p className="text-xs">Searching database...</p>
               </div>
            ) : results.map(p => (
              <button 
                key={p._id}
                onClick={() => selectPatient(p)}
                className={`w-full p-4 flex items-center justify-between hover:bg-teal-50/30 transition-all text-left ${selectedPatient?._id === p._id ? 'bg-teal-50 border-r-4 border-teal-500' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    {p.username.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{p.username}</h4>
                    <p className="text-[10px] text-gray-500">{p.phone}</p>
                  </div>
                </div>
                <ArrowRight className={`w-4 h-4 text-gray-300 ${selectedPatient?._id === p._id ? 'text-teal-500' : ''}`} />
              </button>
            ))}
            {results.length === 0 && !isLoading && (
              <div className="p-12 text-center text-gray-400 text-sm">
                Search for a patient to view their clinical records.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail View */}
      <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {selectedPatient ? (
          <>
            {/* Patient Profile Header */}
            <div className="p-8 bg-gradient-to-br from-teal-600 to-teal-700 text-white flex flex-col md:flex-row md:items-end justify-between gap-6">
               <div className="flex items-center space-x-5">
                  <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center text-teal-600 text-3xl font-black">
                    {selectedPatient.username.charAt(0)}
                  </div>
                  <div className="space-y-1">
                     <h2 className="text-3xl font-black">{selectedPatient.username}</h2>
                     <div className="flex flex-wrap gap-3 opacity-90 font-medium">
                        <span className="flex items-center text-xs bg-white/10 px-2 py-1 rounded-lg"><User className="w-3 h-3 mr-1" /> Age: {selectedPatient.age}</span>
                        <span className="flex items-center text-xs bg-white/10 px-2 py-1 rounded-lg underline underline-offset-4 decoration-white/30 truncate max-w-[150px]"><Mail className="w-3 h-3 mr-1" /> {selectedPatient.email}</span>
                        <span className="flex items-center text-xs bg-white/10 px-2 py-1 rounded-lg"><Phone className="w-3 h-3 mr-1" /> {selectedPatient.phone}</span>
                     </div>
                  </div>
               </div>
               <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest bg-white/10 p-3 rounded-2xl">
                 <MapPin className="w-4 h-4 text-teal-200" />
                 <span>{selectedPatient.address || 'Address Not Provided'}</span>
               </div>
            </div>

            {/* History Tabs Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
               {isHistoryLoading ? (
                 <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Loader2 className="w-12 h-12 animate-spin text-teal-600 mb-4" />
                    <p className="font-bold">Syncing Medical Records...</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Past Appointments */}
                    <div className="space-y-4">
                       <h3 className="font-black text-gray-800 flex items-center uppercase tracking-tighter text-sm">
                         <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                         Clinical Visit Log
                       </h3>
                       <div className="space-y-4 pt-2">
                          {patientHistory?.pastAppointments.map(appt => (
                            <div key={appt._id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm group hover:border-indigo-100 transition-all">
                               <div className="flex justify-between items-start mb-3">
                                  <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider">{new Date(appt.createdAt).toLocaleDateString()}</div>
                                  <div className="flex items-center text-[10px] font-bold text-gray-400"><History className="w-3 h-3 mr-1" /> {appt.status}</div>
                               </div>
                               <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase text-xs">Dr. {appt.doctor?.username}</h4>
                               <p className="text-sm text-gray-500 italic mt-2 line-clamp-2">" {appt.reason} "</p>
                            </div>
                          ))}
                          {patientHistory?.pastAppointments.length === 0 && (
                             <div className="p-8 border-2 border-dashed border-gray-100 rounded-3xl text-center text-gray-400 text-xs italic">No history found.</div>
                          )}
                       </div>
                    </div>

                    {/* Prescriptions */}
                    <div className="space-y-4">
                       <h3 className="font-black text-gray-800 flex items-center uppercase tracking-tighter text-sm">
                         <FileText className="w-4 h-4 mr-2 text-teal-500" />
                         Prescription History
                       </h3>
                       <div className="space-y-4 pt-2">
                          {patientHistory?.prescriptions.map(px => (
                            <div key={px._id} className="bg-white p-6 rounded-3xl border border-teal-50 shadow-sm border-l-4 border-l-teal-500">
                               <div className="flex justify-between items-center mb-4">
                                  <span className="font-black text-gray-900 text-sm tracking-tight">{px.diagnosis}</span>
                                  <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-1 rounded-lg font-bold">{new Date(px.createdAt).toLocaleDateString()}</span>
                               </div>
                               <div className="flex flex-wrap gap-2">
                                  {px.medications.map((m, i) => (
                                    <span key={i} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold text-gray-600">
                                      {m.name} <span className="text-gray-400 font-normal">({m.dosage})</span>
                                    </span>
                                  ))}
                               </div>
                               {px.notes && (
                                 <p className="mt-4 text-[11px] text-gray-400 border-t border-gray-50 pt-2 line-clamp-2 italic">{px.notes}</p>
                               )}
                            </div>
                          ))}
                          {patientHistory?.prescriptions.length === 0 && (
                             <div className="p-8 border-2 border-dashed border-gray-100 rounded-3xl text-center text-gray-400 text-xs italic">No prescriptions issued yet.</div>
                          )}
                       </div>
                    </div>
                 </div>
               )}
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-10">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-gray-200" />
             </div>
             <h3 className="text-2xl font-black text-gray-800 mb-2">Patient Records Database</h3>
             <p className="text-gray-400 max-w-sm font-medium leading-relaxed">Search for a patient by name, phone or email to access their full clinical history and past prescriptions.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorPatients
