import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import Footer from '../components/Footer'

const OwnerLogin = () => {
  const { loginUser, user, searchParams } = useContext(AppContext)
  const navigate = useNavigate()

  // Inputs
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Errors & success UI
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'owner') {
        navigate('/owner')
      } else if (searchParams.location && searchParams.pickupDate && searchParams.returnDate) {
        navigate('/cars')
      } else {
        navigate('/')
      }
    }
  }, [user, navigate, searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    const res = await loginUser(email, password, 'owner')
    if (res.success) {
      setSuccessMsg('Successfully logged in to Owner Portal!')
    } else {
      setErrorMsg(res.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-55 flex flex-col justify-between">
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Auth card container */}
        <div className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 grid grid-cols-1 md:grid-cols-12 animate-scaleIn">
          
          {/* LEFT PANEL: Splendid graphic with copy (5 cols) */}
          <div className="hidden md:flex md:col-span-5 relative bg-slate-950 text-white p-8 flex-col justify-between overflow-hidden">
            {/* Background design */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/40 z-10"></div>
              <img 
                src={assets.banner_car_image} 
                alt="auth car banner" 
                className="w-full h-full object-cover opacity-60 scale-110 object-center animate-pulse" 
                />
            </div>

            <div className="relative z-10">
              <img src={assets.logo} alt="logo" className="h-6 brightness-0 invert" />
            </div>

            <div className="relative z-10 space-y-4">
              <h2 className="text-2xl font-black leading-tight">
                Owner Portal <br />
                Manage & Earn.
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Access your fleet manager, coordinate bookings, manage premium vehicle listings, and verify vehicle registration details.
              </p>
            </div>

            <div className="relative z-10 text-[10px] text-slate-500">
              &copy; {new Date().getFullYear()} CarRental. All rights reserved.
            </div>
          </div>

          {/* RIGHT PANEL: Auth inputs form card (7 cols) */}
          <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            
            <div className="space-y-6">
              
              {/* Form title */}
              <div className="text-left space-y-1.5">
                <h1 className="text-2xl font-black text-gray-900">
                  Partner Sign In
                </h1>
                <p className="text-xs text-gray-400">
                  Please log in to manage your active listings.
                </p>
              </div>

              {/* Status messages */}
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-xs text-rose-600 font-semibold flex items-center gap-2 animate-shake">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-600 font-semibold flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {successMsg}
                </div>
              )}

              {/* Authentication Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. partner@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full text-sm bg-gray-55 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700 transition-all"
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Password</label>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full text-sm bg-gray-55 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700 transition-all"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dull text-white py-3 rounded-xl font-bold text-xs shadow-md hover:shadow-primary/20 active:scale-95 transition-all mt-6 cursor-pointer"
                >
                  Sign In
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>
      <Footer />
    </div>
  )
}

export default OwnerLogin
