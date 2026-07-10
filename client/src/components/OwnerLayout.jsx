import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import { Link, useLocation } from 'react-router-dom'
import { ownerMenuLinks } from '../assets/assets'
import Footer from './Footer'

const OwnerLayout = ({ children }) => {
  const { currentRole, toggleUserRole } = useContext(AppContext)
  const location = useLocation()

  if (currentRole !== 'owner') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <div className="flex-grow max-w-xl mx-auto flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl space-y-6 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">Owner View Required</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              This area contains management dashboards and forms meant for vehicle owners. Please switch your view to Owner to access this page.
            </p>
            <button
              onClick={toggleUserRole}
              className="bg-primary hover:bg-primary-dull text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Switch to Owner View
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar (3 cols) */}
          <aside className="lg:col-span-3">
            {/* Desktop Sticky Sidebar */}
            <div className="hidden lg:block bg-white rounded-2xl border border-gray-150 p-4 shadow-sm space-y-2 sticky top-20">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 py-2 border-b border-gray-50">
                Owner Navigation
              </p>
              {ownerMenuLinks.map((link, index) => {
                const isActive = location.pathname === link.path
                return (
                  <Link
                    key={index}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'text-primary bg-primary/5 shadow-sm font-bold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                    }`}
                  >
                    <img 
                      src={isActive ? link.coloredIcon : link.icon} 
                      alt={link.name} 
                      className="h-5 w-5" 
                    />
                    <span>{link.name}</span>
                  </Link>
                )
              })}
            </div>

            {/* Mobile Navigation Tabs */}
            <div className="lg:hidden flex overflow-x-auto gap-2 bg-white p-2.5 rounded-2xl border border-gray-150 shadow-sm scrollbar-none mb-6">
              {ownerMenuLinks.map((link, index) => {
                const isActive = location.pathname === link.path
                return (
                  <Link
                    key={index}
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all duration-150 ${
                      isActive
                        ? 'text-primary bg-primary/5 border border-primary/20 font-extrabold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <img 
                      src={isActive ? link.coloredIcon : link.icon} 
                      alt={link.name} 
                      className="h-4 w-4" 
                    />
                    <span>{link.name}</span>
                  </Link>
                )
              })}
            </div>
          </aside>

          {/* Children Pages Content (9 cols) */}
          <main className="lg:col-span-9 flex flex-col">
            {children}
          </main>

        </div>
      </div>
      <Footer />
    </div>
  )
}

export default OwnerLayout
