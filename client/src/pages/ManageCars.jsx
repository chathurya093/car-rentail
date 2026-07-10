import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import OwnerLayout from '../components/OwnerLayout.jsx'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const ManageCars = () => {
  const { cars, toggleCarAvailability, deleteCar, user } = useContext(AppContext)
  const navigate = useNavigate()

  const ownerCars = cars.filter(car => car.owner === user?._id)

  const handleDelete = (carId) => {
    if (window.confirm('Are you sure you want to delete this car listing? Doing so will cancel active booking requests for this car.')) {
      deleteCar(carId)
    }
  }

  return (
    <OwnerLayout>
      <div className="space-y-8">
        
        {/* Page Title & Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Manage Listed Cars</h1>
            <p className="text-gray-500 text-xs mt-0.5">Control vehicle availability state, modify descriptions, or remove vehicle listings.</p>
          </div>
          <button
            onClick={() => navigate('/owner/add-car')}
            className="bg-primary hover:bg-primary-dull text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm hover:shadow-primary/10 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer self-start sm:self-auto"
          >
            <img src={assets.addIcon} alt="add" className="h-3.5 w-3.5 brightness-0 invert" />
            <span>List Another Car</span>
          </button>
        </div>

        {/* CARS LISTING GRID */}
        {ownerCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownerCars.map((car) => (
              <div 
                key={car._id} 
                className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm flex flex-col justify-between group"
              >
                {/* Image overlay block */}
                <div className="relative aspect-video bg-slate-50 overflow-hidden border-b border-gray-100">
                  <img 
                    src={car.image} 
                    alt={car.brand} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/60 backdrop-blur-md text-white">
                      {car.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary/90 text-white">
                      ${car.pricePerDay}/day
                    </span>
                  </div>
                </div>

                {/* Details & Actions block */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      {car.brand} <span className="text-gray-500 font-normal">{car.model}</span>
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">Manufacturing Year: {car.year} | {car.location}</p>
                    
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mt-3 mb-4">
                      {car.description}
                    </p>
                  </div>

                  {/* Dynamic Status Switcher & Delete */}
                  <div className="border-t border-gray-50 pt-4 flex items-center justify-between">
                    
                    {/* Toggle Availability Switch */}
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${car.isAvaliable ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {car.isAvaliable ? 'Available' : 'Unavailable'}
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => toggleCarAvailability(car._id)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          car.isAvaliable ? 'bg-emerald-500' : 'bg-gray-250'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            car.isAvaliable ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Delete action button */}
                    <button
                      onClick={() => handleDelete(car._id)}
                      className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 hover:text-rose-600 rounded-xl transition-all cursor-pointer flex items-center justify-center active:scale-90"
                      title="Delete car listing"
                    >
                      <img src={assets.delete_icon} alt="delete" className="h-4 w-4" />
                    </button>

                  </div>

                </div>

              </div>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="bg-white border border-gray-150 rounded-2xl p-16 text-center shadow-sm">
            <div className="bg-primary/5 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <img src={assets.carIconColored} alt="empty" className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Vehicles Listed</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8">
              List your first vehicle to start receiving rental booking requests and earning revenue.
            </p>
            <button
              onClick={() => navigate('/owner/add-car')}
              className="bg-primary hover:bg-primary-dull text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-md hover:shadow-primary/20 active:scale-95 transition-all cursor-pointer"
            >
              List Your First Car
            </button>
          </div>
        )}

      </div>
    </OwnerLayout>
  )
}

export default ManageCars
