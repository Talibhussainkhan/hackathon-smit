import React from 'react'
import { Outlet } from 'react-router-dom'
import DoctorSidebar from './DoctorSidebar'

const DoctorLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <DoctorSidebar />
      <main className="flex-1 overflow-y-auto w-full relative">
        <div className="p-8 h-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default DoctorLayout
