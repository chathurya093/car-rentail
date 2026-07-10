import React from 'react'
import { assets } from '../assets/assets'

const CarCard = ({ car, onRentClick }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden">
      
      {/* Car Image Section */}
      <div className="relative aspect-video w-full bg-slate-50 overflow-hidden">
        <img 
          src={car.image} 
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Availability Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
            car.isAvaliable 
              ? 'bg-emerald-500 text-white' 
              : 'bg-rose-500 text-white'
          }`}>
            {car.isAvaliable ? 'Available' : 'Rented'}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/60 backdrop-blur-md text-white">
            {car.category}
          </span>
        </div>
      </div>

      {/* Car Info Section */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          {/* Brand & Model */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                {car.brand} <span className="text-gray-500 font-normal">{car.model}</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">{car.year}</p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 text-sm font-bold bg-amber-50 px-2 py-0.5 rounded-lg">
              <img src={assets.star_icon} alt="star" className="h-3 w-3" />
              <span>4.8</span>
            </div>
          </div>

          <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
            {car.description}
          </p>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 border-t border-gray-100 pt-4 mb-4">
            
            {/* Seats */}
            <div className="flex items-center gap-2 text-gray-500">
              <img src={assets.users_icon} alt="seats" className="h-4 w-4 opacity-70" />
              <span className="text-xs">{car.seating_capacity} People</span>
            </div>

            {/* Transmission */}
            <div className="flex items-center gap-2 text-gray-500">
              <img src={assets.car_icon} alt="transmission" className="h-4 w-4 opacity-70" />
              <span className="text-xs truncate">{car.transmission}</span>
            </div>

            {/* Fuel */}
            <div className="flex items-center gap-2 text-gray-500">
              <img src={assets.fuel_icon} alt="fuel" className="h-4 w-4 opacity-70" />
              <span className="text-xs">{car.fuel_type}</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-500">
              <img src={assets.location_icon} alt="location" className="h-4 w-4 opacity-70" />
              <span className="text-xs truncate">{car.location}</span>
            </div>

          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
          <div>
            <span className="text-xs text-gray-400 block">Price Per Day</span>
            <span className="text-xl font-extrabold text-primary">${car.pricePerDay}</span>
            <span className="text-xs text-gray-500 font-medium">/day</span>
          </div>
          
          <button
            onClick={() => onRentClick && onRentClick(car)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer ${
              car.isAvaliable 
                ? 'bg-primary text-white hover:bg-primary-dull hover:shadow-md hover:shadow-primary/20' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {car.isAvaliable ? 'Rent Now' : 'Out of Stock'}
          </button>
        </div>
      </div>

    </div>
  )
}

export default CarCard
