import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets, cityList } from '../assets/assets'
import { AppContext } from '../context/AppContext.jsx'
import CarCard from '../components/CarCard'
import Footer from '../components/Footer'

const Home = () => {
  const { cars, setSearchParams, searchParams, user } = useContext(AppContext)
  const navigate = useNavigate()
  
  // Local state for the search bar inputs
  const [location, setLocation] = useState(searchParams.location || '')
  const [pickupDate, setPickupDate] = useState(searchParams.pickupDate || '')
  const [returnDate, setReturnDate] = useState(searchParams.returnDate || '')

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams({
      location,
      pickupDate,
      returnDate
    })
    if (!user) {
      alert("Please sign in or create an account to view and book vehicles matching your search.")
      navigate('/login')
    } else {
      navigate('/cars')
    }
  }

  // Get first 3 available cars for showcase
  const featuredCars = cars.filter(car => car.isAvaliable).slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-br from-blue-550 to-primary/5 py-12 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-gray-100">
          {/* Background decorative blob */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -z-10 -translate-x-20 translate-y-20"></div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <span className="inline-block bg-primary/10 text-primary text-xs font-extrabold tracking-wider uppercase px-4 py-1.5 rounded-full">
                ✨ Easy & Fast Booking
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-none">
                Find, Book, and <br className="hidden sm:inline" />
                <span className="text-primary">Rent a Car</span> in Easy Steps
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
                Compare and choose from our premium, well-maintained fleet. Experience a smooth rental experience with zero hidden costs.
              </p>

              {/* SEARCH CONTAINER */}
              <form 
                onSubmit={handleSearch}
                className="bg-white p-4 rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between mt-8 max-w-2xl mx-auto lg:mx-0"
              >
                {/* Location */}
                <div className="flex items-center gap-3 w-full md:w-auto px-2">
                  <img src={assets.location_icon_colored} alt="location" className="h-6 w-6" />
                  <div className="text-left w-full">
                    <label className="block text-[10px] uppercase font-bold text-gray-400">Location</label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      className="bg-transparent text-sm font-semibold text-gray-800 focus:outline-none w-full border-none p-0 cursor-pointer"
                    >
                      <option value="">Select location</option>
                      {cityList.map((city, idx) => (
                        <option key={idx} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block w-px h-10 bg-gray-200"></div>

                {/* Pickup Date */}
                <div className="flex items-center gap-3 w-full md:w-auto px-2">
                  <img src={assets.calendar_icon_colored} alt="pickup" className="h-6 w-6" />
                  <div className="text-left w-full">
                    <label className="block text-[10px] uppercase font-bold text-gray-400">Pick-up Date</label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="bg-transparent text-sm font-semibold text-gray-800 focus:outline-none w-full cursor-pointer"
                    />
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block w-px h-10 bg-gray-200"></div>

                {/* Return Date */}
                <div className="flex items-center gap-3 w-full md:w-auto px-2">
                  <img src={assets.calendar_icon_colored} alt="return" className="h-6 w-6" />
                  <div className="text-left w-full">
                    <label className="block text-[10px] uppercase font-bold text-gray-400">Return Date</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      required
                      min={pickupDate || new Date().toISOString().split('T')[0]}
                      className="bg-transparent text-sm font-semibold text-gray-800 focus:outline-none w-full cursor-pointer"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dull text-white px-6 py-3 rounded-2xl w-full md:w-auto font-bold text-sm shadow-md hover:shadow-primary/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <img src={assets.search_icon} alt="search" className="h-4 w-4 brightness-0 invert" />
                  <span>Search</span>
                </button>
              </form>
            </div>

            {/* Hero Right image */}
            <div className="lg:col-span-6 flex justify-center relative">
              <div className="absolute top-1/2 left-1/2 w-[110%] h-[110%] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 -z-10"></div>
              <img 
                src={assets.main_car} 
                alt="main car" 
                className="w-full max-w-lg md:max-w-xl h-auto object-contain animate-float hover:rotate-1 transition-all duration-700" 
              />
            </div>

          </div>
        </section>

        {/* FEATURES / WHY CHOOSE US */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-extrabold tracking-wider text-primary uppercase bg-primary/10 px-4 py-1.5 rounded-full">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Our Core Experience Pillars
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
              We focus on comfort, reliability, and modern efficiency to provide the best service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="bg-primary/10 h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-all">
                <img src={assets.users_icon} alt="support" className="h-6 w-6 group-hover:brightness-0 group-hover:invert transition-all" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">24/7 Dedicated Support</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Our support team is always available to help you with booking modifications, roadside assistances, or rental queries.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="bg-primary/10 h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-all">
                <img src={assets.car_icon} alt="support" className="h-6 w-6 group-hover:brightness-0 group-hover:invert transition-all" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Wide Fleet Variety</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Choose from highly maintained sedans, robust SUVs, hybrids, or performance luxury sports vehicles. We have the perfect fit.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="bg-primary/10 h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-all">
                <img src={assets.tick_icon} alt="support" className="h-6 w-6 group-hover:brightness-0 group-hover:invert transition-all" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Instant Booking & Verification</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Secure transaction checkouts, dynamic confirmation workflows, and instant communication with vehicle owners.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURED VEHICLES GRID */}
        <section className="py-16 bg-white px-4 sm:px-6 lg:px-8 border-t border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div className="space-y-3">
                <span className="text-xs font-extrabold tracking-wider text-primary uppercase bg-primary/10 px-4 py-1.5 rounded-full">
                  Featured Fleet
                </span>
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Explore Our Most Popular Rental Cars
                </h2>
              </div>
              <button 
                onClick={() => navigate('/cars')}
                className="mt-4 md:mt-0 text-sm font-bold text-primary hover:text-primary-dull transition-colors flex items-center gap-2 group cursor-pointer"
              >
                <span>View All Vehicles</span>
                <img src={assets.arrow_icon} alt="arrow" className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {featuredCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCars.map((car) => (
                  <CarCard 
                    key={car._id} 
                    car={car} 
                    onRentClick={() => {
                      if (!user) {
                        alert("Please sign in or create an account to book this vehicle.")
                        navigate('/login')
                      } else {
                        navigate('/cars')
                      }
                    }} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No cars available at the moment. Please check back later.
              </div>
            )}
          </div>
        </section>

        {/* PROMO / LIST CAR BANNER */}
        <section className="max-w-7xl mx-auto my-16 px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white min-h-[380px] flex items-center">
            
            {/* Banner Background Image */}
            <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 h-full z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-10"></div>
              <img 
                src={assets.banner_car_image} 
                alt="banner car" 
                className="w-full h-full object-cover opacity-80"
              />
            </div>

            {/* Banner Left Content */}
            <div className="relative z-10 px-8 py-12 md:px-16 max-w-xl space-y-6">
              <span className="inline-block bg-primary text-white text-[10px] font-black uppercase px-3.5 py-1 rounded-md">
                Owner Partnership
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Earn Extra Income. <br />
                List Your Car Today.
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Connect with verified renters in your area and unlock passive earnings from your idle vehicle. We provide insurance protections and booking tools.
              </p>
              <button 
                onClick={() => navigate('/owner/add-car')}
                className="bg-white hover:bg-slate-100 text-slate-950 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Become an Owner
              </button>
            </div>

          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-extrabold tracking-wider text-primary uppercase bg-primary/10 px-4 py-1.5 rounded-full">
              Reviews
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Review 1 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <img key={i} src={assets.star_icon} alt="star" className="h-4 w-4" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm italic leading-relaxed mb-6">
                  "The booking process was incredibly simple. I rented the BMW X5 for a family weekend trip. The car was clean, well-maintained, and listing details matched exactly. The pick-up instructions were seamless!"
                </p>
              </div>
              <div className="flex items-center gap-3">
                <img src={assets.testimonial_image_1} alt="client 1" className="h-12 w-12 rounded-full object-cover border border-primary/20" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Sarah Jenkins</h4>
                  <p className="text-xs text-gray-400">Rented BMW X5 in New York</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <img key={i} src={assets.star_icon} alt="star" className="h-4 w-4" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm italic leading-relaxed mb-6">
                  "I needed a fuel-efficient sedan for business commuting around Chicago. The Toyota Corolla was perfect. Excellent fuel mileage, clean, and the owner was very cooperative and quick to respond."
                </p>
              </div>
              <div className="flex items-center gap-3">
                <img src={assets.testimonial_image_2} alt="client 2" className="h-12 w-12 rounded-full object-cover border border-primary/20" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Michael Davis</h4>
                  <p className="text-xs text-gray-400">Rented Toyota Corolla in Chicago</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}

export default Home
