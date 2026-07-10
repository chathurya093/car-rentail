/* eslint-disable react-hooks/set-state-in-effect */
import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import CarCard from '../components/CarCard'
import Footer from '../components/Footer'
import { assets, cityList } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Cars = () => {
  const { cars, searchParams, setSearchParams, createBooking, user } = useContext(AppContext)
  const navigate = useNavigate()

  // State variables for filtering
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState(searchParams.location || '')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTransmission, setSelectedTransmission] = useState('')
  const [selectedFuel, setSelectedFuel] = useState('')
  const [selectedCapacity, setSelectedCapacity] = useState('')
  const [maxPrice, setMaxPrice] = useState(400) // Default max price

  // Booking Modal State
  const [selectedCarForBooking, setSelectedCarForBooking] = useState(null)
  const [pickupDate, setPickupDate] = useState(searchParams.pickupDate || '')
  const [returnDate, setReturnDate] = useState(searchParams.returnDate || '')
  const [bookingDays, setBookingDays] = useState(1)
  const [totalBookingPrice, setTotalBookingPrice] = useState(0)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  // Reset page search params if initialized
  useEffect(() => {
    if (searchParams.location) {
      setSelectedCity(searchParams.location)
    }
    if (searchParams.pickupDate) {
      setPickupDate(searchParams.pickupDate)
    }
    if (searchParams.returnDate) {
      setReturnDate(searchParams.returnDate)
    }
  }, [searchParams])

  // Calculate booking duration and price
  useEffect(() => {
    if (pickupDate && returnDate && selectedCarForBooking) {
      const pick = new Date(pickupDate)
      const ret = new Date(returnDate)
      const diffTime = ret.getTime() - pick.getTime()
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays <= 0) {
        diffDays = 1 // At least 1 day rental
      }
      setBookingDays(diffDays)
      setTotalBookingPrice(diffDays * selectedCarForBooking.pricePerDay)
    } else if (selectedCarForBooking) {
      setBookingDays(1)
      setTotalBookingPrice(selectedCarForBooking.pricePerDay)
    }
  }, [pickupDate, returnDate, selectedCarForBooking])

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    if (!pickupDate || !returnDate || !selectedCarForBooking) return

    const bookingData = {
      car: selectedCarForBooking,
      pickupDate: new Date(pickupDate).toISOString(),
      returnDate: new Date(returnDate).toISOString(),
      price: totalBookingPrice
    }

    createBooking(bookingData)
    setBookingSuccess(true)

    // Clear search context parameters
    setSearchParams({ location: '', pickupDate: '', returnDate: '' })

    // Redirect to my bookings after showing success
    setTimeout(() => {
      setBookingSuccess(false)
      setSelectedCarForBooking(null)
      navigate('/my-bookings')
    }, 2000)
  }

  // Categories & Specs extracted dynamically
  const categories = [...new Set(cars.map(car => car.category))]
  const transmissions = [...new Set(cars.map(car => car.transmission))]
  const fuelTypes = [...new Set(cars.map(car => car.fuel_type))]
  const capacities = [...new Set(cars.map(car => car.seating_capacity))].sort()

  // Filter cars based on selected parameters
  const filteredCars = cars.filter(car => {
    const matchesSearch = 
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
      car.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCity = selectedCity ? car.location === selectedCity : true
    const matchesCategory = selectedCategory ? car.category === selectedCategory : true
    const matchesTransmission = selectedTransmission ? car.transmission === selectedTransmission : true
    const matchesFuel = selectedFuel ? car.fuel_type === selectedFuel : true
    const matchesCapacity = selectedCapacity ? car.seating_capacity === parseInt(selectedCapacity) : true
    const matchesPrice = car.pricePerDay <= maxPrice

    return matchesSearch && matchesCity && matchesCategory && matchesTransmission && matchesFuel && matchesCapacity && matchesPrice
  })

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedCity('')
    setSelectedCategory('')
    setSelectedTransmission('')
    setSelectedFuel('')
    setSelectedCapacity('')
    setMaxPrice(400)
    setSearchParams({ location: '', pickupDate: '', returnDate: '' })
    setPickupDate('')
    setReturnDate('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between relative">
      <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* HEADER SECTION */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900">Explore Our Fleet</h1>
          <p className="text-gray-500 text-sm">Select the perfect ride from our well-maintained vehicles. Use the filters to find matching rentals.</p>
        </div>

        {/* MAIN FILTER + CATALOG CONTENT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR FILTERS (3 cols) */}
          <aside className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-150 shadow-sm h-fit space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="font-bold text-gray-800 flex items-center gap-2">
                <img src={assets.filter_icon} alt="filter" className="h-4 w-4" />
                Filters
              </span>
              <button 
                onClick={resetFilters}
                className="text-xs text-primary hover:text-primary-dull font-semibold transition-colors cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Search Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase">Search Fleet</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. BMW, Toyota..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pl-10 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all text-gray-700"
                />
                <img src={assets.search_icon} alt="search" className="absolute left-3.5 top-3.5 h-3.5 w-3.5 opacity-40" />
              </div>
            </div>

            {/* City Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase">Location</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700 cursor-pointer"
              >
                <option value="">All Locations</option>
                {cityList.map((city, idx) => (
                  <option key={idx} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700 cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((category, idx) => (
                  <option key={idx} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Transmission Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase">Transmission</label>
              <select
                value={selectedTransmission}
                onChange={(e) => setSelectedTransmission(e.target.value)}
                className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700 cursor-pointer"
              >
                <option value="">All Transmissions</option>
                {transmissions.map((t, idx) => (
                  <option key={idx} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Fuel Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase">Fuel Type</label>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700 cursor-pointer"
              >
                <option value="">All Fuel Types</option>
                {fuelTypes.map((f, idx) => (
                  <option key={idx} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Capacity Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase">Seating Capacity</label>
              <select
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
                className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700 cursor-pointer"
              >
                <option value="">All Seats</option>
                {capacities.map((cap, idx) => (
                  <option key={idx} value={cap}>{cap} People</option>
                ))}
              </select>
            </div>

            {/* Price Filter Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase">
                <span>Max Price Per Day</span>
                <span className="text-primary font-extrabold text-sm">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="400"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>$50</span>
                <span>$400</span>
              </div>
            </div>
          </aside>

          {/* VEHICLE GRID CATALOG (9 cols) */}
          <main className="lg:col-span-9">
            {filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <CarCard 
                    key={car._id} 
                    car={car} 
                    onRentClick={(c) => {
                      if (!user) {
                        alert("Please sign in or create an account to rent this vehicle.")
                        navigate('/login')
                      } else {
                        setSelectedCarForBooking(c)
                      }
                    }} 
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-150 rounded-2xl p-16 text-center shadow-sm">
                <img src={assets.cautionIconColored} alt="no cars" className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Matching Vehicles Found</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                  We couldn't find any vehicles matching your search criteria. Try modifying your filter values or click Reset All to start over.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-primary hover:bg-primary-dull text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>

        </div>

      </div>

      <Footer />

      {/* RENTAL BOOKING MODAL */}
      {selectedCarForBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 animate-scaleIn">
            
            {/* Modal Left Details */}
            <div className="relative bg-slate-50 p-6 flex flex-col justify-between border-r border-gray-100">
              {/* Close Button Mobile */}
              <button 
                onClick={() => setSelectedCarForBooking(null)}
                className="absolute top-4 right-4 bg-white/80 p-2 rounded-full border border-gray-100 text-gray-500 hover:text-gray-800 shadow-sm transition-colors cursor-pointer"
              >
                <img src={assets.close_icon} alt="close" className="h-4 w-4" />
              </button>

              <div>
                <img 
                  src={selectedCarForBooking.image} 
                  alt={selectedCarForBooking.brand}
                  className="w-full aspect-video object-cover rounded-2xl shadow-sm mb-6"
                />
                
                <span className="bg-primary/10 text-primary text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                  {selectedCarForBooking.category}
                </span>
                
                <h2 className="text-2xl font-black text-gray-900 mt-2 mb-3">
                  {selectedCarForBooking.brand} <span className="text-gray-500 font-normal">{selectedCarForBooking.model}</span>
                </h2>
                
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {selectedCarForBooking.description}
                </p>
              </div>

              {/* Specification tags */}
              <div className="grid grid-cols-2 gap-3 border-t border-gray-200/50 pt-4 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <img src={assets.users_icon} alt="seats" className="h-4 w-4 opacity-50" />
                  <span>{selectedCarForBooking.seating_capacity} Seating Capacity</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={assets.car_icon} alt="trans" className="h-4 w-4 opacity-50" />
                  <span>{selectedCarForBooking.transmission}</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={assets.fuel_icon} alt="fuel" className="h-4 w-4 opacity-50" />
                  <span>{selectedCarForBooking.fuel_type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={assets.location_icon} alt="loc" className="h-4 w-4 opacity-50" />
                  <span>{selectedCarForBooking.location}</span>
                </div>
              </div>
            </div>

            {/* Modal Right Rental Form */}
            <div className="p-8 flex flex-col justify-between bg-white relative">
              {/* Close Button Desktop */}
              <button 
                onClick={() => setSelectedCarForBooking(null)}
                className="hidden md:block absolute top-6 right-6 bg-gray-50 p-2 rounded-full border border-gray-150 text-gray-500 hover:text-gray-800 shadow-sm transition-colors cursor-pointer"
              >
                <img src={assets.close_icon} alt="close" className="h-4 w-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Rental Information</h3>
                  <p className="text-xs text-gray-400">Specify dates to proceed with booking details.</p>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {/* Pick up date */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-gray-500 uppercase">Pick-up Date</label>
                    <input 
                      type="date"
                      value={pickupDate}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700"
                    />
                  </div>

                  {/* Return date */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-gray-500 uppercase">Return Date</label>
                    <input 
                      type="date"
                      value={returnDate}
                      required
                      min={pickupDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700"
                    />
                  </div>

                  {/* Pricing Overview */}
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-150 space-y-3 mt-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Daily Rent Cost</span>
                      <span className="font-bold text-gray-800">${selectedCarForBooking.pricePerDay}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Rental Duration</span>
                      <span className="font-bold text-gray-800">{bookingDays} Day{bookingDays > 1 && 's'}</span>
                    </div>
                    <div className="border-t border-gray-200/60 pt-3 flex justify-between items-end">
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase block">Total Cost</span>
                        <span className="text-2xl font-black text-primary">${totalBookingPrice}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">All fees included</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dull text-white py-3.5 rounded-2xl font-bold text-sm shadow-md hover:shadow-primary/20 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <img src={assets.tick_icon} alt="confirm" className="h-4 w-4 brightness-0 invert" />
                    <span>Confirm Booking Reservation</span>
                  </button>
                </form>
              </div>

              {/* SUCCESS OVERLAY */}
              {bookingSuccess && (
                <div className="absolute inset-0 bg-white rounded-3xl z-20 flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
                  <div className="bg-emerald-100 p-4 rounded-full mb-4">
                    <img src={assets.check_icon} alt="success" className="h-10 w-10 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Reservation Confirmed!</h3>
                  <p className="text-sm text-gray-500">Your rental request has been created successfully. Redirecting you to bookings...</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default Cars
