import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import OwnerLayout from '../components/OwnerLayout.jsx'
import { assets } from '../assets/assets'

const ManageBookings = () => {
  const { bookings, user, approveBooking, rejectBooking } = useContext(AppContext)
  
  // Tabs: 'all', 'pending', 'active', 'cancelled'
  const [activeTab, setActiveTab] = useState('all')

  // Filter bookings belonging to the owner's listed cars
  const ownerBookings = bookings.filter(booking => booking.car?.owner === user?._id || booking.owner === user?._id)

  const handleApprove = (bookingId) => {
    approveBooking(bookingId)
  }

  const handleReject = (bookingId) => {
    if (window.confirm('Are you sure you want to reject this rental booking request?')) {
      rejectBooking(bookingId)
    }
  }

  // Filter by tab
  const filteredBookings = ownerBookings.filter(b => {
    if (activeTab === 'all') return true
    if (activeTab === 'pending') return b.status === 'pending'
    if (activeTab === 'active') return b.status === 'confirmed' || b.status === 'completed'
    if (activeTab === 'cancelled') return b.status === 'cancelled' || b.status === 'rejected'
    return true
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">Confirmed</span>
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">Pending Approval</span>
      case 'completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">Completed</span>
      case 'rejected':
      case 'cancelled':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">{status === 'rejected' ? 'Rejected' : 'Cancelled'}</span>
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-50 text-gray-700 border border-gray-100">{status}</span>
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <OwnerLayout>
      <div className="space-y-8">
        
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-black text-gray-900">Manage Booking Requests</h1>
          <p className="text-gray-500 text-xs mt-0.5">Approve, reject, or track scheduling details for customer rental requests.</p>
        </div>

        {/* TAB FILTER CONTROLS */}
        <div className="flex border-b border-gray-200 gap-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-3.5 px-2 border-b-2 text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'all'
                ? 'border-primary text-primary font-black'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            All Bookings ({ownerBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-3.5 px-2 border-b-2 text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pending'
                ? 'border-primary text-primary font-black'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            Pending ({ownerBookings.filter(b => b.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`py-3.5 px-2 border-b-2 text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'active'
                ? 'border-primary text-primary font-black'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            Confirmed/Completed ({ownerBookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length})
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`py-3.5 px-2 border-b-2 text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'cancelled'
                ? 'border-primary text-primary font-black'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            Cancelled/Rejected ({ownerBookings.filter(b => b.status === 'cancelled' || b.status === 'rejected').length})
          </button>
        </div>

        {/* BOOKINGS LIST */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div 
                key={booking._id} 
                className="bg-white rounded-2xl border border-gray-150 p-6 flex flex-col md:flex-row gap-6 items-center justify-between shadow-sm"
              >
                
                {/* Left: Info Grid */}
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left w-full md:w-auto">
                  <img 
                    src={booking.car?.image} 
                    alt={booking.car?.brand} 
                    className="h-24 w-36 object-cover rounded-xl border border-gray-250/50" 
                  />
                  <div className="space-y-1.5">
                    <span className="inline-block bg-slate-100 text-slate-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                      {booking.car?.category || 'Car'}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 leading-tight">
                      {booking.car?.brand || 'N/A'} <span className="text-gray-500 font-normal">{booking.car?.model || ''}</span>
                    </h3>
                    <p className="text-[10px] text-gray-400">
                      Renter ID: <span className="font-semibold text-gray-700">#{booking.user?.substr(-6)}</span> | Total Price: <span className="font-bold text-primary">${booking.price}</span>
                    </p>

                    {/* Rent dates */}
                    <div className="pt-2">
                      <div className="bg-gray-50 border border-gray-150/60 rounded-lg p-2 text-[11px] font-bold text-gray-600 inline-flex items-center gap-2">
                        <span>Pick: {formatDate(booking.pickupDate)}</span>
                        <span className="text-primary">→</span>
                        <span>Return: {formatDate(booking.returnDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Status and Approve/Reject controls */}
                <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
                  
                  {/* Status Badge */}
                  <div>
                    {getStatusBadge(booking.status)}
                  </div>

                  {/* Actions buttons */}
                  {booking.status === 'pending' && (
                    <div className="flex items-center gap-2 mt-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleReject(booking._id)}
                        className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 text-xs font-bold text-gray-500 transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 w-full sm:w-auto"
                      >
                        <img src={assets.close_icon} alt="reject" className="h-3 w-3 opacity-60 hover:opacity-100" />
                        <span>Reject Request</span>
                      </button>
                      <button
                        onClick={() => handleApprove(booking._id)}
                        className="px-4 py-2 bg-primary hover:bg-primary-dull text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer active:scale-95 w-full sm:w-auto"
                      >
                        <img src={assets.tick_icon} alt="approve" className="h-3 w-3 brightness-0 invert" />
                        <span>Approve Request</span>
                      </button>
                    </div>
                  )}

                </div>

              </div>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-1">No Bookings Found</h3>
            <p className="text-gray-500 text-xs max-w-sm mx-auto">
              There are currently no bookings listings in this tab. Any bookings matching this filter state will render here.
            </p>
          </div>
        )}

      </div>
    </OwnerLayout>
  )
}

export default ManageBookings
