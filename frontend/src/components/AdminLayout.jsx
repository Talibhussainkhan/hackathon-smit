import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto w-full">
        <div className="p-8 h-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
