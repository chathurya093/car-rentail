import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & About */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2">
              {/* Force white-looking logo filter or render styled title */}
              <img src={assets.logo} alt="logo" className="h-8 brightness-0 invert" />
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Premium car rental services in your city. Experience hassle-free bookings, 
              high-quality verified listings, and unparalleled 24/7 client support.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="p-2 bg-slate-800 hover:bg-primary rounded-full transition-colors group">
                <img src={assets.facebook_logo} alt="facebook" className="h-4 w-4 group-hover:brightness-0 group-hover:invert transition-all" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-primary rounded-full transition-colors group">
                <img src={assets.instagram_logo} alt="instagram" className="h-4 w-4 group-hover:brightness-0 group-hover:invert transition-all" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-primary rounded-full transition-colors group">
                <img src={assets.twitter_logo} alt="twitter" className="h-4 w-4 group-hover:brightness-0 group-hover:invert transition-all" />
              </a>
              <a href="#" className="p-2 bg-slate-800 hover:bg-primary rounded-full transition-colors group">
                <img src={assets.gmail_logo} alt="gmail" className="h-4 w-4 group-hover:brightness-0 group-hover:invert transition-all" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-bold tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/cars" className="hover:text-primary transition-colors">Our Fleet</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Business Hours & Contact */}
          <div>
            <h3 className="text-white text-sm font-bold tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Email: support@carrental.com</li>
              <li>Phone: +1 (555) 019-2834</li>
              <li>Hours: 24/7 Support</li>
              <li>Office: 100 Broadway, NY</li>
            </ul>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} CarRental. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
