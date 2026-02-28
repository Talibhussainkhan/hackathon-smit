import React from 'react'
import { Outlet } from 'react-router-dom'
import ReceptionistSidebar from './ReceptionistSidebar'

const ReceptionistLayout = () => {
  return (
    <div className="flex h-screen bg-rose-50/30 font-sans">
      <ReceptionistSidebar />
      <main className="flex-1 overflow-y-auto w-full relative">
        <div className="p-8 h-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default ReceptionistLayout
