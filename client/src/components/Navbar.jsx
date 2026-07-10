import React, { useState, useContext, useRef, useEffect } from 'react'
import { assets, menuLinks, ownerMenuLinks } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'

const Navbar = () => {
  const { currentRole, toggleUserRole, user, logoutUser } = useContext(AppContext)
  const location = useLocation()
  const navigate = useNavigate()
  
  const [open, setOpen] = useState(false) // Mobile drawer
  const [dropdownOpen, setDropdownOpen] = useState(false) // Profile dropdown
  const dropdownRef = useRef(null)

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Choose links based on current role and login status
  const links = !user 
    ? menuLinks.filter(link => link.path === '/' || link.path === '/cars') // Public links
    : currentRole === 'owner' 
      ? ownerMenuLinks 
      : menuLinks

  const handleSignOut = () => {
    logoutUser()
    setDropdownOpen(false)
    setOpen(false)
    navigate('/')
  }

  return (
    <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-bordercolor z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to={user && currentRole === 'owner' ? '/owner' : '/'} className="flex items-center gap-2">
              <img src={assets.logo} alt="logo" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'text-primary bg-primary/5 shadow-sm font-bold'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {link.icon && (
                  <img
                    src={location.pathname === link.path ? link.coloredIcon : link.icon}
                    alt={link.name}
                    className="h-4 w-4"
                  />
                )}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side: Auth buttons / Profile dropdown */}
          <div className="hidden md:flex items-center space-x-4">
            
            {!user ? (
              /* LOGGED OUT: Sign In CTA */
              <Link
                to="/login"
                className="bg-primary hover:bg-primary-dull text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md hover:shadow-primary/20 active:scale-95 transition-all cursor-pointer"
              >
                Sign In
              </Link>
            ) : (
              /* LOGGED IN: Profile Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1 pr-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-150 transition-all cursor-pointer"
                >
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-8 w-8 rounded-full border-2 border-primary/20 object-cover shadow-inner"
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-800 leading-none">{user.name}</p>
                    <p className="text-[9px] text-gray-400 capitalize mt-0.5">{currentRole === 'owner' ? 'Owner view' : 'Customer view'}</p>
                  </div>
                  <img src={assets.arrow_icon} alt="arrow" className={`h-3 w-3 opacity-60 transition-transform ${dropdownOpen ? 'rotate-90' : 'rotate-0'}`} />
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl border border-gray-150 shadow-xl overflow-hidden z-50 animate-scaleIn">
                    {/* User info summary */}
                    <div className="p-4 bg-gray-50 border-b border-gray-100 text-left">
                      <p className="text-sm font-black text-gray-900 leading-none">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate mt-1">{user.email}</p>
                      <span className="inline-block bg-primary/10 text-primary text-[9px] font-black uppercase px-2 py-0.5 rounded-md mt-2">
                        {user.role} Account
                      </span>
                    </div>

                    {/* Management controls */}
                    <div className="p-2 space-y-1">
                      {/* Owner view toggle (only for registered owners) */}
                      {user.role === 'owner' && (
                        <button
                          onClick={() => {
                            toggleUserRole()
                            setDropdownOpen(false)
                            navigate(currentRole === 'owner' ? '/' : '/owner')
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-primary transition-all cursor-pointer"
                        >
                          <img src={assets.carIconColored} alt="switch" className="h-4 w-4" />
                          <span>Switch to {currentRole === 'owner' ? 'Customer' : 'Owner'} View</span>
                        </button>
                      )}

                      {/* Sign out */}
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold text-rose-600 hover:bg-rose-50/50 transition-all cursor-pointer border-t border-gray-50"
                      >
                        <img src={assets.delete_icon} alt="signout" className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Mobile hamburger menu button */}
          <div className="md:hidden flex items-center gap-4">
            
            {!user ? (
              <Link
                to="/login"
                className="bg-primary hover:bg-primary-dull text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                Sign In
              </Link>
            ) : (
              /* Profile shortcut avatar */
              <div className="flex items-center gap-2">
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-8 w-8 rounded-full border-2 border-primary/20 object-cover"
                />
                {user.role === 'owner' && (
                  <button
                    onClick={() => {
                      toggleUserRole()
                      navigate(currentRole === 'owner' ? '/' : '/owner')
                    }}
                    className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all"
                  >
                    {currentRole === 'owner' ? 'Owner' : 'Customer'}
                  </button>
                )}
              </div>
            )}

            <button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-primary hover:bg-gray-50 focus:outline-none"
            >
              <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden absolute top-16 left-0 w-full bg-white border-b border-bordercolor shadow-lg transition-all duration-300 ease-in-out transform ${
          open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 bg-white text-left">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold ${
                location.pathname === link.path
                  ? 'text-primary bg-primary/5 border-l-4 border-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
              }`}
            >
              {link.icon && (
                <img
                  src={location.pathname === link.path ? link.coloredIcon : link.icon}
                  alt={link.name}
                  className="h-5 w-5"
                />
              )}
              {link.name}
            </Link>
          ))}

          {/* Mobile Profile & Sign out details */}
          {user && (
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center gap-3 px-4">
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-10 w-10 rounded-full border-2 border-primary/25 object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-gray-800 leading-none">{user.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{user.email}</p>
                </div>
              </div>
              <div className="px-4">
                <button
                  onClick={handleSignOut}
                  className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <img src={assets.delete_icon} alt="signout" className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar


