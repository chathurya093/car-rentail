import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import Footer from '../components/Footer'

const Login = () => {
  const { user } = useContext(AppContext)
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'owner') {
        navigate('/owner')
      } else {
        navigate('/')
      }
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Portal card container */}
        <div className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 p-8 sm:p-12 animate-scaleIn space-y-8">
          
          <div className="text-center space-y-2">
            <img src={assets.logo} alt="logo" className="h-10 mx-auto" />
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mt-4">Welcome to CarRental</h1>
            <p className="text-sm text-gray-555 max-w-md mx-auto">
              Please choose your portal below to sign in or register your account.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            
            {/* CARD 1: CUSTOMER PORTAL */}
            <div className="group bg-gray-55 hover:bg-white rounded-2xl p-8 border border-gray-150 hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left">
              <div className="space-y-4">
                <div className="bg-primary/10 group-hover:bg-primary text-primary group-hover:text-white h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">Customer Portal</h2>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Rent premium vehicles for your trips. View and manage your current bookings, explore 100+ car listings, and track your rentals.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/login-customer')}
                className="mt-8 w-full bg-primary hover:bg-primary-dull text-white py-3 rounded-xl font-bold text-xs shadow-md group-hover:shadow-primary/20 active:scale-95 transition-all cursor-pointer text-center"
              >
                Enter Customer Portal
              </button>
            </div>

            {/* CARD 2: OWNER PORTAL */}
            <div className="group bg-gray-55 hover:bg-white rounded-2xl p-8 border border-gray-150 hover:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left">
              <div className="space-y-4">
                <div className="bg-slate-100 group-hover:bg-slate-900 text-slate-700 group-hover:text-white h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                  </svg>
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-slate-900 transition-colors">Owner Portal</h2>
                  <p className="text-xs text-gray-555 leading-relaxed">
                    List and rent out your vehicles to earn revenue. Coordinate bookings, track analytics, manage listings, and verify vehicle registrations.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/owner-login')}
                className="mt-8 w-full bg-slate-900 hover:bg-slate-950 text-white py-3 rounded-xl font-bold text-xs shadow-md group-hover:shadow-slate-950/20 active:scale-95 transition-all cursor-pointer text-center"
              >
                Enter Partner Portal
              </button>
            </div>

          </div>

        </div>

      </div>
      <Footer />
    </div>
  )
}

export default Login
