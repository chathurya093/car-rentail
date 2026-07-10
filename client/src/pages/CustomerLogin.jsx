import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import Footer from '../components/Footer'

const CustomerLogin = () => {
  const { loginUser, registerUser, user, searchParams } = useContext(AppContext)
  const navigate = useNavigate()

  // Form mode: 'login' or 'register'
  const [mode, setMode] = useState('login')
  
  // Inputs
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState('')
  
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

    if (mode === 'login') {
      const res = await loginUser(email, password, 'customer')
      if (res.success) {
        setSuccessMsg('Successfully logged in!')
      } else {
        setErrorMsg(res.message)
      }
    } else {
      if (!firstName || !lastName) {
        setErrorMsg('Please enter your first name and last name')
        return
      }
      if (!phoneNumber || !address) {
        setErrorMsg('Please fill out all registration fields (Phone Number and Address)')
        return
      }
      const fullName = `${firstName} ${lastName}`
      const res = await registerUser(fullName, email, password, 'customer', { firstName, lastName, phoneNumber, address })
      if (res.success) {
        setSuccessMsg('Account registered successfully!')
      } else {
        if (res.message === 'Email address already registered') {
          setErrorMsg('This email is already registered. Switching to Sign In...')
          setTimeout(() => {
            setMode('login')
            setErrorMsg('Please enter your password to sign in.')
          }, 1500)
        } else {
          setErrorMsg(res.message)
        }
      }
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
                Unlock the Best <br />
                Rental Experience.
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log in to coordinate bookings, manage premium vehicle listings, or unlock access to 100+ rental options.
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
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-xs text-gray-400">
                  {mode === 'login' ? 'Please log in to manage your active rentals.' : 'Sign up to begin booking or listing vehicles.'}
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
                
                {/* First Name & Last Name (Register Mode only) */}
                {mode === 'register' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">First Name</label>
                      <input
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full text-sm bg-gray-55 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700 transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase">Last Name</label>
                      <input
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full text-sm bg-gray-55 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full text-sm bg-gray-55 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700 transition-all"
                  />
                </div>

                {/* Phone Number (Register Mode only) */}
                {mode === 'register' && (
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. +1 555-0199"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="w-full text-sm bg-gray-55 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700 transition-all"
                    />
                  </div>
                )}

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

                {/* Address (Register Mode only) */}
                {mode === 'register' && (
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Billing Address</label>
                    <input
                      type="text"
                      placeholder="e.g. 123 Main St, New York, NY"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="w-full text-sm bg-gray-55 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700 transition-all"
                    />
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dull text-white py-3 rounded-xl font-bold text-xs shadow-md hover:shadow-primary/20 active:scale-95 transition-all mt-6 cursor-pointer"
                >
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </button>

              </form>

              {/* Mode Toggle Link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('')
                    setSuccessMsg('')
                    setMode(mode === 'login' ? 'register' : 'login')
                  }}
                  className="text-xs text-primary font-bold hover:underline cursor-pointer"
                >
                  {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                </button>
              </div>



            </div>

          </div>

        </div>

      </div>
      <Footer />
    </div>
  )
}

export default CustomerLogin
