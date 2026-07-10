import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import OwnerLayout from '../components/OwnerLayout.jsx'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const OwnerDashboard = () => {
  const { cars, bookings, user } = useContext(AppContext)

  // Calculate dynamic stats based on current global state
  const ownerCarsCount = cars.filter(c => c.owner === user?._id).length
  
  // Bookings made on owner's cars
  const ownerBookings = bookings.filter(b => b.car?.owner === user?._id || b.owner === user?._id)
  
  const pendingCount = ownerBookings.filter(b => b.status === 'pending').length
  const completedCount = ownerBookings.filter(b => b.status === 'completed').length
  const confirmedCount = ownerBookings.filter(b => b.status === 'confirmed').length
  
  // Total Revenue from confirmed and completed bookings
  const totalRevenue = ownerBookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.price, 0)

  // Get recent 4 bookings
  const recentBookings = ownerBookings.slice(0, 4)

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">Confirmed</span>
      case 'pending':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">Pending</span>
      case 'completed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">Completed</span>
      case 'rejected':
      case 'cancelled':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100">{status}</span>
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-50 text-gray-700 border border-gray-100">{status}</span>
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <OwnerLayout>
      <div className="space-y-8">
        
        {/* Page title */}
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 text-xs mt-0.5">Real-time statistics and listing analytics for your rental listings.</p>
        </div>

        {/* KPI METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenue */}
          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm flex items-center gap-4">
            <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-100">
              {/* Dollar Icon representation */}
              <span className="text-xl font-bold text-emerald-600">$</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block font-semibold uppercase">Total Revenue</span>
              <span className="text-2xl font-black text-slate-900">${totalRevenue}</span>
            </div>
          </div>

          {/* Active Listings */}
          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm flex items-center gap-4">
            <div className="bg-primary/10 p-3.5 rounded-xl border border-primary/20">
              <img src={assets.carIconColored} alt="listings" className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-gray-400 block font-semibold uppercase">Active Listings</span>
              <span className="text-2xl font-black text-slate-900">{ownerCarsCount}</span>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm flex items-center gap-4">
            <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-100">
              <img src={assets.cautionIconColored} alt="pending" className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-gray-400 block font-semibold uppercase">Pending Bookings</span>
              <span className="text-2xl font-black text-slate-900">{pendingCount}</span>
            </div>
          </div>

          {/* Bookings Completed */}
          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm flex items-center gap-4">
            <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-100">
              <img src={assets.listIconColored} alt="completed" className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs text-gray-400 block font-semibold uppercase">Completed Trips</span>
              <span className="text-2xl font-black text-slate-900">{completedCount + confirmedCount}</span>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: RECENT BOOKINGS & CHARTS */}
        <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Booking Activity</h2>
            <Link 
              to="/owner/manage-bookings" 
              className="text-xs font-bold text-primary hover:text-primary-dull transition-colors"
            >
              Manage Bookings
            </Link>
          </div>

          {/* TABLE */}
          {recentBookings.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-4 pl-6">Vehicle</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Rental Dates</th>
                    <th className="p-4">Revenue</th>
                    <th className="p-4 pr-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {recentBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6 flex items-center gap-3">
                        <img 
                          src={b.car?.image} 
                          alt={b.car?.brand} 
                          className="h-10 w-16 object-cover rounded-lg border border-gray-200" 
                        />
                        <div>
                          <p className="font-bold text-gray-900">{b.car?.brand || 'N/A'}</p>
                          <p className="text-[10px] text-gray-400">{b.car?.model || ''}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-gray-800">Customer #{b.user?.substr(-5)}</p>
                        <p className="text-[10px] text-gray-400">ID: {b.user?.substr(0, 10)}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-gray-800">{formatDate(b.pickupDate)}</p>
                        <p className="text-[10px] text-primary font-bold">to {formatDate(b.returnDate)}</p>
                      </td>
                      <td className="p-4 font-bold text-primary">
                        ${b.price}
                      </td>
                      <td className="p-4 pr-6">
                        {getStatusBadge(b.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              No recent bookings found.
            </div>
          )}
        </div>

      </div>
    </OwnerLayout>
  )
}

export default OwnerDashboard
