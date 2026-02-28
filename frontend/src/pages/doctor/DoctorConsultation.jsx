import React, { useState } from 'react'
import { FilePlus, MessageSquareWarning, Send, Plus, Trash2, CheckCircle2 } from 'lucide-react'

const DoctorConsultation = () => {
  const [activeTab, setActiveTab] = useState('notes')
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [prescriptions, setPrescriptions] = useState([{ name: '', dosage: '', duration: '' }])

  const addPrescriptionRow = () => {
    setPrescriptions([...prescriptions, { name: '', dosage: '', duration: '' }])
  }

  const removePrescriptionRow = (index) => {
    const updated = prescriptions.filter((_, i) => i !== index)
    setPrescriptions(updated)
  }

  return (
    <div className="flex h-full gap-6">
      {/* Main Consultation Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${aiPanelOpen ? 'pr-0' : ''}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-5 mb-6">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Active Consultation</h1>
              <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border border-red-200 shadow-sm">
                Live
              </span>
            </div>
            <p className="text-gray-500 mt-2 font-medium">Patient: <span className="text-gray-800">Michael Brown</span> • Age: 45 • ID: #101</p>
          </div>
          <button 
            onClick={() => setAiPanelOpen(!aiPanelOpen)}
            className={`flex items-center px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm ${
              aiPanelOpen 
                ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border border-indigo-200' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-indigo-200'
            }`}
          >
            <MessageSquareWarning className="w-5 h-5 mr-2" />
            {aiPanelOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
          </button>
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
          <div className="flex border-b border-gray-100 bg-gray-50/50">
            <button 
              className={`px-6 py-4 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'notes' ? 'text-teal-600 border-teal-600 bg-white' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
              onClick={() => setActiveTab('notes')}
            >
              Clinical Notes & Diagnosis
            </button>
            <button 
              className={`px-6 py-4 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'prescription' ? 'text-teal-600 border-teal-600 bg-white' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
              onClick={() => setActiveTab('prescription')}
            >
              Prescriptions (<span className="text-xs">{prescriptions.length}</span>)
            </button>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            {activeTab === 'notes' && (
              <div className="space-y-6 h-full flex flex-col">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subjective / Symptoms (Patient's Words)</label>
                  <textarea 
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none h-32 text-gray-800"
                    placeholder="E.g., Patient reports throbbing headache for 3 days..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Objective / Clinical Findings</label>
                  <textarea 
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none h-32 text-gray-800"
                    placeholder="E.g., BP 130/85, Temp 98.6°F, mild photophobia observed..."
                  ></textarea>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2 text-red-600">Final Assessment / Diagnosis *</label>
                  <input 
                    type="text" 
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-900 font-medium shadow-sm"
                    placeholder="Enter ICD-10 or descriptive diagnosis (e.g. Migraine without aura)"
                  />
                </div>
              </div>
            )}

            {activeTab === 'prescription' && (
              <div className="space-y-6 h-full flex flex-col">
                <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <h3 className="font-semibold text-blue-900">Medications</h3>
                  <button 
                    onClick={addPrescriptionRow}
                    className="flex items-center text-sm font-bold text-blue-700 hover:text-blue-800 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-blue-200 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Medicine
                  </button>
                </div>
                
                <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                  {prescriptions.map((px, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Medicine Name</label>
                        <input type="text" placeholder="e.g. Amoxicillin 500mg" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
                      </div>
                      <div className="w-full md:w-48">
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Dosage / Freq</label>
                        <input type="text" placeholder="1 tablet 3x daily" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
                      </div>
                      <div className="w-full md:w-32">
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Duration</label>
                        <input type="text" placeholder="7 days" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" />
                      </div>
                      <button 
                        onClick={() => removePrescriptionRow(index)}
                        className="mt-6 p-2.5 text-red-500 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors flex-shrink-0"
                        title="Remove"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {prescriptions.length === 0 && (
                    <div className="text-center py-10 text-gray-400 font-medium">
                      No prescriptions added yet. Let's write one!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
            <button className="px-6 py-2.5 text-gray-600 font-semibold hover:bg-gray-200 rounded-xl transition-colors">
              Save Draft
            </button>
            <button className="px-6 py-2.5 bg-teal-600 text-white font-semibold hover:bg-teal-700 rounded-xl shadow-sm transition-colors flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Sign & Complete Consultation
            </button>
          </div>
        </div>
      </div>

      {/* AI Assistant Sidebar Panel */}
      {aiPanelOpen && (
        <div className="w-[380px] bg-white rounded-2xl shadow-lg border border-indigo-100 flex flex-col overflow-hidden mt-20 transition-all transform origin-right animate-in slide-in-from-right-4 duration-300 relative z-10 h-[calc(100vh-140px)]">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 border-b border-indigo-200 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquareWarning className="w-5 h-5" />
                <h3 className="font-bold text-lg tracking-wide">Medi-AI Assistant</h3>
              </div>
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-200 border-2 border-white"></span>
              </span>
            </div>
            <p className="text-indigo-100 text-xs mt-1 font-medium">Context: Clinical Decision Support</p>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 space-y-4">
            {/* Initial AI Message */}
            <div className="flex space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm">
                <FilePlus className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-sm text-gray-700 leading-relaxed font-medium">
                Hello Dr. Smith. I'm reviewing Michael Brown's history. I noticed a past allergy to <span className="text-red-600 font-bold bg-red-50 px-1 rounded">Penicillin</span>. 
                <br/><br/>
                How can I assist with this consultation? I can suggest differential diagnoses or check drug interactions.
              </div>
            </div>

            {/* Simulated User Message */}
            <div className="flex space-x-3 justify-end mt-4">
              <div className="bg-indigo-600 p-3.5 rounded-2xl rounded-tr-none shadow-sm text-sm text-white leading-relaxed font-medium">
                Patient has a severe headache, what are safe alternatives to NSAIDs given his history?
              </div>
            </div>

            {/* AI Response Text Skeleton */}
            <div className="flex space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm">
                <FilePlus className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-sm text-gray-500 italic">
                AI is typing...
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border-t border-gray-100">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Ask about symptoms, drugs..." 
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all"
              />
              <button className="absolute right-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-400 mt-2">AI suggestions should be verified clinically.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorConsultation
