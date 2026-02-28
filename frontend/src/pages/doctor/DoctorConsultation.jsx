import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FilePlus, MessageSquareWarning, Send, Plus, Trash2, CheckCircle2, Loader2, CalendarClock, History } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const DoctorConsultation = () => {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('notes')
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAiLoading, setIsAiLoading] = useState(false)
  
  const [appointment, setAppointment] = useState(null)
  const [patientHistory, setPatientHistory] = useState({ pastAppointments: [], prescriptions: [] })
  
  const [consultNotes, setConsultNotes] = useState({ subjective: '', objective: '', diagnosis: '' })
  const [medications, setMedications] = useState([{ name: '', dosage: '', duration: '', instructions: '' }])
  
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiExplanations, setAiExplanations] = useState([])

  useEffect(() => {
    fetchConsultationData()
  }, [appointmentId])

  const fetchConsultationData = async () => {
    setIsLoading(true)
    try {
      const appointmentsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/doctor/appointments`, { withCredentials: true })
      const currentAppt = appointmentsRes.data.find(a => a._id === appointmentId)
      
      if (!currentAppt) {
        toast.error("Appointment not found")
        navigate('/doctor/appointments')
        return
      }
      
      setAppointment(currentAppt)
      
      const historyRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/doctor/patient-history/${currentAppt.patient._id}`, { withCredentials: true })
      setPatientHistory(historyRes.data)
    } catch (error) {
      toast.error("Failed to load consultation data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAiAssist = async () => {
    if (!consultNotes.diagnosis && !consultNotes.subjective && !consultNotes.objective) {
      toast.error("Please add symptoms or a diagnosis first")
      return
    }
    
    setIsAiLoading(true)
    setAiPanelOpen(true)
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/doctor/ai-assist`, 
        { 
          diagnosis: consultNotes.diagnosis, 
          medications: medications.filter(m => m.name !== ''),
          subjective: consultNotes.subjective,
          objective: consultNotes.objective
        },
        { withCredentials: true }
      )
      setAiExplanations(prev => [...prev, { role: 'ai', text: data.explanation }])
    } catch (error) {
      toast.error("AI Assistance failed")
    } finally {
      setIsAiLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!consultNotes.diagnosis) return toast.error("Diagnosis is required")
    
    setIsSubmitting(true)
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/doctor/prescription`, {
        appointmentId,
        patientId: appointment.patient._id,
        diagnosis: consultNotes.diagnosis,
        medications: medications.filter(m => m.name !== ''),
        notes: `Subjective: ${consultNotes.subjective} | Objective: ${consultNotes.objective}`,
        aiExplanation: aiExplanations.filter(msg => msg.role === 'ai').map(msg => msg.text).join('\n\n')
      }, { withCredentials: true })
      
      toast.success("Consultation completed successfully")
      navigate('/doctor/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.error || "Submission failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addMedRow = () => setMedications([...medications, { name: '', dosage: '', duration: '', instructions: '' }])
  
  const removeMedRow = (index) => setMedications(medications.filter((_, i) => i !== index))

  const handleMedChange = (index, field, value) => {
    const updated = [...medications]
    updated[index][field] = value
    setMedications(updated)
  }

  const handleAiChat = async (e) => {
    if (e) e.preventDefault()
    if (!aiPrompt.trim()) return
    
    const userMsg = aiPrompt
    setAiPrompt('')
    setAiExplanations(prev => [...prev, { role: 'user', text: userMsg }])
    
    setIsAiLoading(true)
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/doctor/ai-assist`, 
        { diagnosis: consultNotes.diagnosis, medications, query: userMsg },
        { withCredentials: true }
      )
      setAiExplanations(prev => [...prev, { role: 'ai', text: data.explanation }])
    } catch (error) {
      toast.error("AI response failed")
    } finally {
      setIsAiLoading(false)
    }
  }

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-full text-teal-600">
      <Loader2 className="w-12 h-12 animate-spin mb-4" />
      <p className="font-bold text-lg">Initializing Clinical Session...</p>
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      {/* Main Consultation Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-5 mb-6 gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Consultation</h1>
              <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border border-red-200 shadow-sm animate-pulse">
                Live
              </span>
            </div>
            <p className="text-gray-500 mt-2 font-medium">
              Patient: <span className="text-gray-900 font-bold">{appointment?.patient?.username}</span> • Age: {appointment?.patient?.age} • Phone: {appointment?.patient?.phone}
            </p>
          </div>
          <button 
            onClick={() => handleAiAssist()}
            disabled={isAiLoading}
            className="flex items-center px-5 py-3 rounded-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
          >
            {isAiLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <MessageSquareWarning className="w-5 h-5 mr-2" />}
            AI Assistance
          </button>
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden min-h-[500px]">
          <div className="flex border-b border-gray-100 bg-gray-50/50">
            {['notes', 'prescription', 'history'].map((tab) => (
              <button 
                key={tab}
                className={`px-8 py-4 font-bold text-sm transition-all border-b-2 capitalize ${activeTab === tab ? 'text-teal-600 border-teal-600 bg-white' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'notes' ? 'Clinical Notes' : tab}
              </button>
            ))}
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            {activeTab === 'notes' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center">Subjective Symptoms</label>
                    <textarea 
                      value={consultNotes.subjective}
                      onChange={(e) => setConsultNotes({...consultNotes, subjective: e.target.value})}
                      className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none h-40"
                      placeholder="Symptoms reported by patient..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Objective Findings</label>
                    <textarea 
                      value={consultNotes.objective}
                      onChange={(e) => setConsultNotes({...consultNotes, objective: e.target.value})}
                      className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none h-40"
                      placeholder="Clinical observations, vital signs..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-red-600 flex items-center">Final Diagnosis <span className="text-red-300 ml-1">*</span></label>
                  <input 
                    type="text" 
                    value={consultNotes.diagnosis}
                    onChange={(e) => setConsultNotes({...consultNotes, diagnosis: e.target.value})}
                    className="w-full p-4 border-2 border-red-50 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-900 font-bold bg-red-50/10 shadow-sm"
                    placeholder="E.g., Acute Pharyngitis"
                  />
                </div>
              </div>
            )}

            {activeTab === 'prescription' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                   <h3 className="font-bold text-blue-900 flex items-center"><FilePlus className="w-5 h-5 mr-2" /> Medical Prescription</h3>
                   <button onClick={addMedRow} className="bg-white px-4 py-2 rounded-xl text-xs font-extra-bold text-blue-700 shadow-sm border border-blue-200 hover:bg-blue-50 transition-all flex items-center">
                     <Plus className="w-4 h-4 mr-1" /> Add Medicine
                   </button>
                </div>
                
                <div className="space-y-4">
                  {medications.map((med, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 bg-gray-50/80 rounded-2xl border border-gray-100 relative group hover:bg-white hover:shadow-md transition-all">
                      <div className="md:col-span-5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Medicine Name</label>
                        <input value={med.name} onChange={(e) => handleMedChange(idx, 'name', e.target.value)} type="text" className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium" placeholder="Paracetamol 500mg" />
                      </div>
                      <div className="md:col-span-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Dosage</label>
                        <input value={med.dosage} onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)} type="text" className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium" placeholder="1-1-1" />
                      </div>
                      <div className="md:col-span-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Duration</label>
                        <input value={med.duration} onChange={(e) => handleMedChange(idx, 'duration', e.target.value)} type="text" className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium" placeholder="5 Days" />
                      </div>
                      <div className="md:col-span-1 flex items-end justify-center">
                        <button onClick={() => removeMedRow(idx)} className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="flex items-center font-bold text-gray-700 text-sm"><CalendarClock className="w-4 h-4 mr-2" /> Last Visited</h4>
                    {patientHistory.pastAppointments.filter(a => a._id !== appointmentId).slice(0, 5).map(appt => (
                      <div key={appt._id} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 text-sm">
                         <div className="flex justify-between items-start mb-2">
                           <span className="font-bold text-gray-900">{appt.date}</span>
                           <span className="text-xs uppercase bg-white px-2 py-0.5 rounded border text-gray-400">{appt.status}</span>
                         </div>
                         <p className="text-gray-500 italic">{appt.reason}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                     <h4 className="flex items-center font-bold text-gray-700 text-sm"><History className="w-4 h-4 mr-2" /> Past Prescriptions</h4>
                     {patientHistory.prescriptions.map(px => (
                        <div key={px._id} className="p-4 border border-orange-100 rounded-2xl bg-orange-50/30 text-sm">
                           <p className="font-bold text-orange-900 mb-2">{px.diagnosis}</p>
                           <div className="flex flex-wrap gap-2">
                             {px.medications.map((m, i) => (
                               <span key={i} className="bg-white px-2 py-1 rounded text-[10px] font-bold text-gray-600 border border-orange-100">{m.name}</span>
                             ))}
                           </div>
                           <p className="text-[10px] text-gray-400 mt-2">By Dr. {px.doctor?.username} on {new Date(px.createdAt).toLocaleDateString()}</p>
                        </div>
                     ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
            <button disabled={isSubmitting} className="px-8 py-3 bg-teal-600 text-white font-bold hover:bg-teal-700 rounded-2xl shadow-lg shadow-teal-100 transition-all flex items-center disabled:opacity-50" onClick={handleSubmit}>
              {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
              Complete & Sign Consultation
            </button>
          </div>
        </div>
      </div>

      {/* AI Assistant Drawer */}
      {(aiPanelOpen || isAiLoading) && (
        <div className="w-full lg:w-96 bg-white rounded-3xl shadow-2xl border border-indigo-100 flex flex-col overflow-hidden h-[calc(100vh-140px)] animate-in slide-in-from-right-4 duration-500 shrink-0">
           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white flex justify-between items-center shrink-0">
             <div className="flex items-center space-x-3">
               <MessageSquareWarning className="w-6 h-6" />
               <h3 className="font-bold text-lg">AI Clinical Guide</h3>
             </div>
             <button onClick={() => setAiPanelOpen(false)} className="bg-white/20 p-1 rounded-lg hover:bg-white/30"><Plus className="w-5 h-5 rotate-45" /></button>
           </div>
           
           <div className="flex-1 p-5 overflow-y-auto space-y-6 bg-gray-50/50">
              {aiExplanations.map((msg, i) => (
                <div key={i} className={`flex space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-[10px] ${msg.role === 'user' ? 'bg-teal-600' : 'bg-indigo-600'}`}>
                    {msg.role === 'user' ? 'DR' : 'AI'}
                  </div>
                  <div className={`p-4 rounded-2xl border shadow-sm text-sm leading-relaxed font-medium ${
                    msg.role === 'user' 
                      ? 'bg-teal-50 border-teal-100 text-teal-900 rounded-tr-none' 
                      : 'bg-white border-indigo-50 text-gray-800 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex space-x-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0"><Loader2 className="w-4 h-4 text-white animate-spin" /></div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-indigo-50 shadow-sm text-xs text-gray-400 italic">Analyzing medical context...</div>
                </div>
              )}
              {aiExplanations.length === 0 && !isAiLoading && (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-400"><MessageSquareWarning className="w-8 h-8" /></div>
                  <p className="text-gray-400 text-sm font-medium">Add diagnosis and symptoms to get AI-powered treatment insights.</p>
                </div>
              )}
           </div>
           
           <form onSubmit={handleAiChat} className="p-4 bg-white border-t border-gray-100">
              <div className="relative">
                <input 
                  value={aiPrompt} 
                  onChange={(e) => setAiPrompt(e.target.value)} 
                  type="text" 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none pr-12" 
                  placeholder="Ask follow-up questions..." 
                />
                <button type="submit" className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
           </form>
        </div>
      )}
    </div>
  )
}

export default DoctorConsultation
