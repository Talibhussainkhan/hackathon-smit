import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import ReceptionistSidebar from './ReceptionistSidebar'
import { Menu, X } from 'lucide-react'

const ReceptionistLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-rose-50/30 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <ReceptionistSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-rose-100 z-30">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              R
            </div>
            <h2 className="text-lg font-bold text-gray-800 leading-tight">Front Desk</h2>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto w-full p-4 md:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default ReceptionistLayout
