import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import RoleProtectedRoute from './components/RoleProtectedRoute'
import RoleRedirect from './components/RoleRedirect'
import Login from './pages/Login'
import Signup from './pages/Signup'

import AdminLayout from './components/AdminLayout'
import AdminOverview from './pages/admin/AdminOverview'
import AdminDoctors from './pages/admin/AdminDoctors'
import AdminReceptionists from './pages/admin/AdminReceptionists'
import AdminSubscriptions from './pages/admin/AdminSubscriptions'

// Doctor Views
import DoctorLayout from './components/doctor/DoctorLayout'
import DoctorOverview from './pages/doctor/DoctorOverview'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import DoctorConsultation from './pages/doctor/DoctorConsultation'
import DoctorAnalytics from './pages/doctor/DoctorAnalytics'
import DoctorPatients from './pages/doctor/DoctorPatients'

// Receptionist Views
import ReceptionistLayout from './components/receptionist/ReceptionistLayout'
import ReceptionistOverview from './pages/receptionist/ReceptionistOverview'
import ReceptionistPatients from './pages/receptionist/ReceptionistPatients'
import ReceptionistAppointments from './pages/receptionist/ReceptionistAppointments'

// Patient Views
import PatientLayout from './components/patient/PatientLayout'
import PatientOverview from './pages/patient/PatientOverview'
import PatientAppointments from './pages/patient/PatientAppointments'
import PatientPrescriptions from './pages/patient/PatientPrescriptions'

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
       
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RoleRedirect />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminOverview />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="receptionists" element={<AdminReceptionists />} />
          <Route path="subscriptions" element={<AdminSubscriptions />} />
        </Route>

        {/* Doctor Routes */}
        <Route
          path="/doctor"
          element={
            <RoleProtectedRoute allowedRoles={['doctor']}>
              <DoctorLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DoctorOverview />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="analytics" element={<DoctorAnalytics />} />
          <Route path="consultation" element={<Navigate to="/doctor/appointments" replace />} />
          <Route path="consultation/:appointmentId" element={<DoctorConsultation />} />
        </Route>

        {/* Receptionist Routes */}
        <Route
          path="/receptionist"
          element={
            <RoleProtectedRoute allowedRoles={['receptionist']}>
              <ReceptionistLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ReceptionistOverview />} />
          <Route path="patients" element={<ReceptionistPatients />} />
          <Route path="appointments" element={<ReceptionistAppointments />} />
        </Route>

        {/* Patient Routes */}
        <Route
          path="/patient"
          element={
            <RoleProtectedRoute allowedRoles={['patient']}>
              <PatientLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PatientOverview />} />
          <Route path="appointments" element={<PatientAppointments />} />
          <Route path="prescriptions" element={<PatientPrescriptions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App