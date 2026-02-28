import React from 'react'
import { Outlet } from 'react-router-dom'
import PatientSidebar from './PatientSidebar'

const PatientLayout = () => {
  return (
    <div className="flex h-screen bg-emerald-50/30 font-sans">
      <PatientSidebar />
      <main className="flex-1 overflow-y-auto w-full relative">
        <div className="p-8 h-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default PatientLayout
