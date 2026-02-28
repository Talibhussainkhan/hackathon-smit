import React, { useState, useEffect } from 'react'
import { Pill, Download, Sparkles, Clock, CalendarDays, Loader2, ShieldCheck } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedAi, setExpandedAi] = useState(null)

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const fetchPrescriptions = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/patient/my-prescriptions`, { withCredentials: true })
      setPrescriptions(data)
    } catch (error) {
      toast.error("Failed to load your prescriptions")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadPdf = (id) => {
    toast.success(`Preparing document for ${id}...`)
    window.print()
  }

  const toggleAiExplanation = (id) => {
    if (expandedAi === id) setExpandedAi(null)
    else setExpandedAi(id)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-emerald-100 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">My Prescriptions</h1>
          <p className="text-gray-500 mt-1">View your medications and AI-simplified explanations.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-emerald-50 flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="overflow-y-auto flex-1 p-6 bg-gray-50/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prescriptions.length > 0 ? (
              prescriptions.map((rx) => (
                <div key={rx._id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                  
                  {/* Card Header */}
                  <div className="p-5 flex justify-between items-start border-b bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Pill className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-bold text-lg text-gray-900">Rx-#{rx._id.slice(-5).toUpperCase()}</h3>
                      </div>
                      <p className="text-sm font-semibold text-gray-600 mt-2 flex items-center">
                         Prescribed by Dr. {rx.doctor?.username}
                      </p>
                      <p className="text-xs font-semibold text-gray-400 mt-1 flex items-center">
                         <CalendarDays className="w-3.5 h-3.5 mr-1" /> {new Date(rx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => handleDownloadPdf(rx._id)}
                      className="p-2.5 bg-white border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-300 rounded-xl shadow-sm transition-all group"
                      title="Download PDF"
                    >
                      <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>

                  {/* Medications List */}
                  <div className="p-5 flex-1 space-y-4">
                    <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Medications</h4>
                    <ul className="space-y-4">
                      {rx.medications.map((med, idx) => (
                        <li key={idx} className="flex flex-col">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-gray-900 text-lg">{med.name} <span className="text-sm font-semibold text-emerald-600 ml-1">{med.dosage}</span></span>
                          </div>
                          <div className="flex items-center text-sm font-medium text-gray-500 mt-1 opacity-90">
                            <Clock className="w-4 h-4 mr-1.5 text-gray-400" /> {med.instructions || 'As directed'}
                          </div>
                          <div className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded inline-block w-max mt-2">
                            Duration: {med.duration}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AI Explanation Toggle & Content */}
                  <div className="border-t border-gray-100 bg-gray-50">
                    <button 
                      onClick={() => toggleAiExplanation(rx._id)}
                      className="w-full p-4 flex justify-between items-center hover:bg-emerald-50/50 transition-colors group"
                    >
                      <div className="flex items-center text-sm font-bold text-indigo-600 group-hover:text-indigo-700">
                        <Sparkles className="w-4 h-4 mr-2" /> What are these for? (AI Summary)
                      </div>
                      <ShieldCheck className={`w-4 h-4 text-gray-400 transition-transform ${expandedAi === rx._id ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedAi === rx._id && (
                      <div className="p-5 pt-0 bg-emerald-50/20 border-t border-indigo-50 animate-in slide-in-from-top-2 duration-200">
                        <p className="text-sm text-gray-700 leading-relaxed font-medium bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm relative">
                          <span className="absolute -top-2 -left-2 bg-indigo-500 text-white rounded-full p-1 border-2 border-white shadow-sm">
                            <Sparkles className="w-3 h-3" />
                          </span>
                          {rx.aiExplanation || "An AI explanation is not available for this prescription. Please consult your doctor for details."}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-3 flex items-center justify-center font-medium">
                          Always consult your doctor if you have specific medical concerns.
                        </p>
                      </div>
                    )}
                  </div>
                  
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                <Pill className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="font-bold text-lg text-gray-600">No prescriptions yet</p>
                <p className="text-sm text-gray-400 mt-1 font-medium">Any new medications prescribed will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientPrescriptions
