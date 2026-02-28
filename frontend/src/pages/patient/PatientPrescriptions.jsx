import React, { useState } from 'react'
import { Pill, Download, Sparkles, Clock, CalendarDays, ExternalLink, ShieldCheck } from 'lucide-react'

const PatientPrescriptions = () => {
  const [activeTab, setActiveTab] = useState('Active')
  const [expandedAi, setExpandedAi] = useState(null) // ID of prescription to show AI info for

  const prescriptions = [
    { 
      id: 'Rx-10492', 
      doctor: 'Dr. Sarah Smith', 
      date: '2023-10-25',
      status: 'Active',
      medications: [
        { name: 'Lisinopril', dosage: '10mg', frequency: '1 tablet daily', duration: '90 days' },
        { name: 'Atorvastatin', dosage: '20mg', frequency: '1 tablet at bedtime', duration: '90 days' }
      ],
      aiExplanation: "Lisinopril is an ACE inhibitor used to treat high blood pressure. Atorvastatin belongs to a group of drugs called HMG CoA reductase inhibitors (statins) that reduce levels of 'bad' cholesterol. Taking these helps manage cardiovascular risks."
    },
    { 
      id: 'Rx-08311', 
      doctor: 'Dr. John Doe', 
      date: '2023-01-10',
      status: 'Past',
      medications: [
        { name: 'Amoxicillin', dosage: '500mg', frequency: '1 capsule 3x daily', duration: '7 days' }
      ],
      aiExplanation: "Amoxicillin is a penicillin antibiotic that fights bacteria. It was prescribed for a short-term bacterial infection. It's important to finish the entire course to prevent antibiotic resistance."
    }
  ]

  const filteredRx = prescriptions.filter(rx => rx.status === activeTab)

  const handleDownloadPdf = (id) => {
    // Simulated print/download action
    console.log(`Downloading PDF for ${id}...`)
    window.print()
  }

  const toggleAiExplanation = (id) => {
    if (expandedAi === id) setExpandedAi(null)
    else setExpandedAi(id)
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-emerald-100 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">My Prescriptions</h1>
          <p className="text-gray-500 mt-1">View your medications and AI-simplified explanations.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-emerald-50 flex-1 flex flex-col min-h-0">
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <button 
            className={`px-6 py-4 font-bold text-sm transition-colors border-b-2 ${activeTab === 'Active' ? 'text-emerald-600 border-emerald-600 bg-white shadow-sm' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
            onClick={() => setActiveTab('Active')}
          >
            Active Prescriptions
          </button>
          <button 
            className={`px-6 py-4 font-bold text-sm transition-colors border-b-2 ${activeTab === 'Past' ? 'text-emerald-600 border-emerald-600 bg-white shadow-sm' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
            onClick={() => setActiveTab('Past')}
          >
            Past Prescriptions
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 bg-gray-50/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRx.length > 0 ? (
              filteredRx.map((rx) => (
                <div key={rx.id} className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                  
                  {/* Card Header */}
                  <div className={`p-5 flex justify-between items-start border-b ${rx.status === 'Active' ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Pill className={`w-5 h-5 ${rx.status === 'Active' ? 'text-emerald-600' : 'text-gray-500'}`} />
                        <h3 className="font-bold text-lg text-gray-900">{rx.id}</h3>
                        {rx.status === 'Active' && (
                          <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest shadow-sm">Active</span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-600 mt-2 flex items-center">
                         Prescribed by {rx.doctor}
                      </p>
                      <p className="text-xs font-semibold text-gray-400 mt-1 flex items-center">
                         <CalendarDays className="w-3.5 h-3.5 mr-1" /> {rx.date}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => handleDownloadPdf(rx.id)}
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
                            <Clock className="w-4 h-4 mr-1.5 text-gray-400" /> {med.frequency}
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
                      onClick={() => toggleAiExplanation(rx.id)}
                      className="w-full p-4 flex justify-between items-center hover:bg-emerald-50/50 transition-colors group"
                    >
                      <div className="flex items-center text-sm font-bold text-indigo-600 group-hover:text-indigo-700">
                        <Sparkles className="w-4 h-4 mr-2" /> What are these for? (AI Summary)
                      </div>
                      <ShieldCheck className={`w-4 h-4 text-gray-400 transition-transform ${expandedAi === rx.id ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedAi === rx.id && (
                      <div className="p-5 pt-0 bg-emerald-50/20 border-t border-indigo-50 animate-in slide-in-from-top-2 duration-200">
                        <p className="text-sm text-gray-700 leading-relaxed font-medium bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm relative">
                          <span className="absolute -top-2 -left-2 bg-indigo-500 text-white rounded-full p-1 border-2 border-white shadow-sm">
                            <Sparkles className="w-3 h-3" />
                          </span>
                          {rx.aiExplanation}
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
                <p className="font-bold text-lg text-gray-600">No {activeTab.toLowerCase()} prescriptions</p>
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
