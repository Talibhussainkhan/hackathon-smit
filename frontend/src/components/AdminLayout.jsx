import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import { Menu, X } from 'lucide-react'

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 z-30">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Admin Panel
          </h2>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto w-full p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
