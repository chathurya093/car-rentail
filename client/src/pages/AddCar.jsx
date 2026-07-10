import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import OwnerLayout from '../components/OwnerLayout.jsx'
import { assets, cityList } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const AddCar = () => {
  const { addCar } = useContext(AppContext)
  const navigate = useNavigate()

  // Form states
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [category, setCategory] = useState('Sedan')
  const [seatingCapacity, setSeatingCapacity] = useState('4')
  const [fuelType, setFuelType] = useState('Hybrid')
  const [transmission, setTransmission] = useState('Automatic')
  const [pricePerDay, setPricePerDay] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  
  // Image state
  const [imagePreview, setImagePreview] = useState(null)
  const [success, setSuccess] = useState(false)

  // Handle image upload and generate a DataURL preview
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Form validation
    if (!brand || !model || !year || !pricePerDay || !location || !description) {
      alert('Please fill out all required fields')
      return
    }

    const newCar = {
      brand,
      model,
      year: parseInt(year),
      category,
      seating_capacity: parseInt(seatingCapacity),
      fuel_type: fuelType,
      transmission,
      pricePerDay: parseInt(pricePerDay),
      location,
      description,
      // Use the preview base64 image if available, else fallback to standard placeholder
      image: imagePreview || assets.car_image1
    }

    addCar(newCar)
    setSuccess(true)

    // Redirect to listings after short interval
    setTimeout(() => {
      setSuccess(false)
      navigate('/owner/manage-cars')
    }, 1800)
  }

  return (
    <OwnerLayout>
      <div className="space-y-8 relative">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-black text-gray-900">List a New Vehicle</h1>
          <p className="text-gray-500 text-xs mt-0.5">Provide specifications and images to list a vehicle for rent.</p>
        </div>

        {/* FORM CONTAINER */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-150 p-6 md:p-8 shadow-sm space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Side: Image Upload Block (4 cols) */}
            <div className="md:col-span-4 space-y-4">
              <label className="block text-xs font-bold text-gray-500 uppercase">Vehicle Photo</label>
              
              <div className="relative group border-2 border-dashed border-gray-200 hover:border-primary/50 transition-colors rounded-2xl aspect-video md:aspect-[4/3] flex flex-col items-center justify-center overflow-hidden bg-gray-55 cursor-pointer">
                {imagePreview ? (
                  <>
                    <img 
                      src={imagePreview} 
                      alt="preview" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white text-xs font-bold bg-slate-900/80 px-3 py-1.5 rounded-xl">Change Photo</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <img src={assets.upload_icon} alt="upload" className="h-10 w-10 mx-auto opacity-40 group-hover:scale-105 transition-transform" />
                    <p className="text-xs font-bold text-gray-500">Upload Image</p>
                    <p className="text-[10px] text-gray-400">Supports JPG, PNG formats</p>
                  </div>
                )}
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
            </div>

            {/* Right Side: Inputs Grid (8 cols) */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Brand */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase">Car Brand *</label>
                <input
                  type="text"
                  placeholder="e.g. BMW, Mercedes, Toyota"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700"
                />
              </div>

              {/* Model */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase">Model Name *</label>
                <input
                  type="text"
                  placeholder="e.g. X5, C-Class, Corolla"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase">Location City *</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700 cursor-pointer"
                >
                  <option value="">Select location</option>
                  {cityList.map((city, idx) => (
                    <option key={idx} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase">Daily Price ($) *</label>
                <input
                  type="number"
                  placeholder="e.g. 150"
                  value={pricePerDay}
                  onChange={(e) => setPricePerDay(e.target.value)}
                  required
                  min="1"
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700 cursor-pointer"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              {/* Seating Capacity */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase">Seating Capacity</label>
                <select
                  value={seatingCapacity}
                  onChange={(e) => setSeatingCapacity(e.target.value)}
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700 cursor-pointer"
                >
                  <option value="2">2 Seater</option>
                  <option value="4">4 Seater</option>
                  <option value="5">5 Seater</option>
                  <option value="7">7 Seater</option>
                </select>
              </div>

              {/* Transmission */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase">Transmission Type</label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700 cursor-pointer"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="Semi-Automatic">Semi-Automatic</option>
                </select>
              </div>

              {/* Fuel Type */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase">Fuel Type</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700 cursor-pointer"
                >
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                  <option value="Petrol">Petrol</option>
                </select>
              </div>

              {/* Year */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase">Manufacturing Year *</label>
                <input
                  type="number"
                  placeholder="e.g. 2022"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700"
                />
              </div>

            </div>
          </div>

          {/* Description Block */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase">Vehicle Description *</label>
            <textarea
              rows="4"
              placeholder="Provide a detailed description of the car specifications, special conditions, rules, or rental conditions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white text-gray-700 resize-none"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-100 pt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/owner/manage-cars')}
              className="px-6 py-3 rounded-2xl text-sm font-bold border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dull text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-md hover:shadow-primary/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <img src={assets.addIcon} alt="add" className="h-4 w-4 brightness-0 invert" />
              <span>List Vehicle</span>
            </button>
          </div>

        </form>

        {/* SUCCESS NOTIFICATION */}
        {success && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 animate-scaleIn">
              <div className="bg-emerald-100 p-4 rounded-full w-fit mx-auto mb-4">
                <img src={assets.check_icon} alt="success" className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Listing Success!</h3>
              <p className="text-xs text-gray-500">Your vehicle has been listed and is now available in the customer search catalog. Redirecting...</p>
            </div>
          </div>
        )}
      </div>
    </OwnerLayout>
  )
}

export default AddCar
