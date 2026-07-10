import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Cars from './pages/Cars'
import MyBookings from './pages/MyBookings'
import OwnerDashboard from './pages/OwnerDashboard'
import AddCar from './pages/AddCar'
import ManageCars from './pages/ManageCars'
import ManageBookings from './pages/ManageBookings'
import Login from './pages/Login'
import CustomerLogin from './pages/CustomerLogin'
import OwnerLogin from './pages/OwnerLogin'
import { AppContext } from './context/AppContext.jsx'

// Protected Route for general authenticated pages (Customers / Owners)
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AppContext)
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Protected Route for Owners only
const OwnerRoute = ({ children }) => {
  const { user } = useContext(AppContext)
  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (user.role !== 'owner') {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center p-8 text-center">
        <div className="bg-white border border-gray-150 p-8 rounded-3xl space-y-6 shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-black text-rose-600">Access Denied</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            This area contains management dashboards restricted to vehicle owners only. Standard customer accounts cannot access these pages.
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    )
  }
  return children
}

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-customer" element={<CustomerLogin />} />
          <Route path="/owner-login" element={<OwnerLogin />} />
          
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          } />
          
          <Route path="/owner" element={
            <OwnerRoute>
              <OwnerDashboard />
            </OwnerRoute>
          } />
          <Route path="/owner/add-car" element={
            <OwnerRoute>
              <AddCar />
            </OwnerRoute>
          } />
          <Route path="/owner/manage-cars" element={
            <OwnerRoute>
              <ManageCars />
            </OwnerRoute>
          } />
          <Route path="/owner/manage-bookings" element={
            <OwnerRoute>
              <ManageBookings />
            </OwnerRoute>
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App