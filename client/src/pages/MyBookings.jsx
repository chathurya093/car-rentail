import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

const MyBookings = () => {
  const { bookings, user, cancelBooking } = useContext(AppContext)
  const navigate = useNavigate()

  // Filter bookings belonging to the current user
  const myBookings = bookings.filter(booking => booking.user === user?._id)

  const handleCancel = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Confirmed
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            Pending Approval
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
            Completed
          </span>
        )
      case 'rejected':
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
            {status === 'rejected' ? 'Rejected' : 'Cancelled'}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-700 border border-gray-100">
            {status}
          </span>
        )
    }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Title Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900">My Rental Bookings</h1>
          <p className="text-gray-500 text-sm">Review your booking requests, confirmed reservations, and rental history.</p>
        </div>

        {/* BOOKINGS LIST */}
        {myBookings.length > 0 ? (
          <div className="space-y-6">
            {myBookings.map((booking) => (
              <div 
                key={booking._id} 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col md:flex-row gap-6 items-center justify-between"
              >
                
                {/* Car details & Booking Dates */}
                <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto items-center sm:items-start text-center sm:text-left">
                  {/* Car thumbnail */}
                  <img 
                    src={booking.car?.image} 
                    alt={booking.car?.brand} 
                    className="h-28 w-44 object-cover rounded-xl border border-gray-150/60 shadow-sm"
                  />
                  
                  {/* Description & specs */}
                  <div className="space-y-2 max-w-sm">
                    <span className="inline-block bg-slate-100 text-slate-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                      {booking.car?.category || 'Car'}
                    </span>
                    <h3 className="text-lg font-extrabold text-gray-950">
                      {booking.car?.brand || 'N/A'} <span className="text-gray-550 font-medium">{booking.car?.model || ''}</span>
                    </h3>
                    
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <img src={assets.location_icon} alt="location" className="h-3.5 w-3.5 opacity-60" />
                        <span>{booking.car?.location || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <img src={assets.fuel_icon} alt="fuel" className="h-3.5 w-3.5 opacity-60" />
                        <span>{booking.car?.fuel_type || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Booking Dates info */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 inline-block mt-2">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Reservation Period</p>
                      <p className="text-xs text-gray-700 font-semibold flex items-center gap-2">
                        <span>{formatDate(booking.pickupDate)}</span>
                        <span className="text-primary font-bold">→</span>
                        <span>{formatDate(booking.returnDate)}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vertical Divider for big screen */}
                <div className="hidden md:block h-16 w-px bg-gray-100"></div>

                {/* Price, Status & Actions */}
                <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto mt-4 md:mt-0">
                  <div className="text-center md:text-right">
                    <span className="text-xs text-gray-400 block font-semibold uppercase">Total Rental Fee</span>
                    <span className="text-2xl font-black text-primary">${booking.price}</span>
                  </div>

                  <div>
                    {getStatusBadge(booking.status)}
                  </div>

                  {/* Cancel Button */}
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="mt-2 text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 hover:bg-rose-100 px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 hover:text-rose-650 active:scale-95"
                    >
                      <img src={assets.delete_icon} alt="cancel" className="h-3.5 w-3.5" />
                      <span>Cancel Rental Request</span>
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="bg-white border border-gray-150 rounded-2xl p-16 text-center shadow-sm">
            <div className="bg-primary/5 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <img src={assets.carIconColored} alt="no bookings" className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8">
              It looks like you haven't booked any vehicles yet. Explore our premium catalog and book your next trip.
            </p>
            <button
              onClick={() => navigate('/cars')}
              className="bg-primary hover:bg-primary-dull text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-md hover:shadow-primary/20 active:scale-95 transition-all cursor-pointer"
            >
              Browse Available Cars
            </button>
          </div>
        )}

      </div>

      <Footer />
    </div>
  )
}

export default MyBookings
