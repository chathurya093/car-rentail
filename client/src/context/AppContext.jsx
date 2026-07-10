/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import { dummyCarData, dummyMyBookingsData, dummyUserData } from '../assets/assets';

const API_URL = 'https://car-rentail.onrender.com/api';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [cars, setCars] = useState(() => {
    const saved = localStorage.getItem('cars');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    // Set all dummy cars to be owned by the default owner "6847f7cab3d8daecdb517095"
    return dummyCarData.map((car) => {
      return { ...car, owner: "6847f7cab3d8daecdb517095" };
    });
  });
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    // Set all dummy bookings' owner to "6847f7cab3d8daecdb517095" and align their car owner properties
    return dummyMyBookingsData.map((b) => {
      const ownerId = "6847f7cab3d8daecdb517095";
      return {
        ...b,
        owner: ownerId,
        car: { ...b.car, owner: ownerId }
      };
    });
  });
  
  // Users database
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('usersList');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return [
      {
        _id: "6847f7cab3d8daecdb517095",
        name: "GreatStack",
        email: "admin@example.com",
        password: "password",
        role: "owner",
        image: dummyUserData.image,
        vehicleNo: "NY-902-83B",
        carName: "BMW X5",
        drivingLicenseNo: "DL-908234-A"
      },
      {
        _id: "user_john_doe",
        name: "John Doe",
        email: "john@example.com",
        password: "password",
        role: "customer",
        image: dummyUserData.image
      }
    ];
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return null;
  });

  const [currentRole, setCurrentRole] = useState(() => {
    const saved = localStorage.getItem('currentRole');
    return saved || 'customer';
  });

  // On mount: fetch source of truth from backend
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`${API_URL}/data`);
        if (!response.ok) throw new Error('API server error');
        const result = await response.json();
        if (result.success) {
          if (result.cars) setCars(result.cars);
          if (result.bookings) setBookings(result.bookings);
          if (result.usersList) setUsersList(result.usersList);
        }
      } catch (error) {
        console.warn('Backend server is not running. Using local storage/dummy data fallback:', error.message);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    localStorage.setItem('cars', JSON.stringify(cars));
  }, [cars]);

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('usersList', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('currentRole', currentRole);
  }, [currentRole]);
  
  // Search parameters from home page search
  const [searchParams, setSearchParams] = useState({
    location: '',
    pickupDate: '',
    returnDate: ''
  });

  const addCar = async (newCar) => {
    const formattedCar = {
      ...newCar,
      owner: user ? user._id : 'owner_unknown'
    };

    try {
      const response = await fetch(`${API_URL}/cars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedCar)
      });
      if (!response.ok) throw new Error('API error');
      const result = await response.json();
      if (result.success) {
        setCars((prev) => [result.car, ...prev]);
      }
    } catch (error) {
      console.warn('Backend offline. Performing local fallback for addCar.');
      const localCar = {
        ...formattedCar,
        _id: 'car_' + Math.random().toString(36).substr(2, 9),
        isAvaliable: true,
        createdAt: new Date().toISOString()
      };
      setCars((prev) => [localCar, ...prev]);
    }
  };

  const deleteCar = async (carId) => {
    try {
      const response = await fetch(`${API_URL}/cars/${carId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('API error');
      const result = await response.json();
      if (result.success) {
        setCars((prev) => prev.filter((c) => c._id !== carId));
        setBookings((prev) => prev.map((b) => b.car?._id === carId ? { ...b, status: 'cancelled' } : b));
      }
    } catch (error) {
      console.warn('Backend offline. Performing local fallback for deleteCar.');
      setCars((prev) => prev.filter((c) => c._id !== carId));
      setBookings((prev) => prev.map((b) => b.car?._id === carId ? { ...b, status: 'cancelled' } : b));
    }
  };

  const toggleCarAvailability = async (carId) => {
    try {
      const response = await fetch(`${API_URL}/cars/${carId}/availability`, {
        method: 'PATCH'
      });
      if (!response.ok) throw new Error('API error');
      const result = await response.json();
      if (result.success) {
        setCars((prev) => prev.map((c) => c._id === carId ? result.car : c));
      }
    } catch (error) {
      console.warn('Backend offline. Performing local fallback for toggleCarAvailability.');
      setCars((prev) => prev.map((c) => c._id === carId ? { ...c, isAvaliable: !c.isAvaliable } : c));
    }
  };

  const createBooking = async (booking) => {
    const formattedBooking = {
      ...booking,
      user: user ? user._id : 'user_guest',
      owner: booking.car.owner
    };

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedBooking)
      });
      if (!response.ok) throw new Error('API error');
      const result = await response.json();
      if (result.success) {
        setBookings((prev) => [result.booking, ...prev]);
      }
    } catch (error) {
      console.warn('Backend offline. Performing local fallback for createBooking.');
      const localBooking = {
        ...formattedBooking,
        _id: 'booking_' + Math.random().toString(36).substr(2, 9),
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      setBookings((prev) => [localBooking, ...prev]);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });
      if (!response.ok) throw new Error('API error');
      const result = await response.json();
      if (result.success) {
        setBookings((prev) => prev.map((b) => b._id === bookingId ? result.booking : b));
      }
    } catch (error) {
      console.warn('Backend offline. Performing local fallback for cancelBooking.');
      setBookings((prev) => prev.map((b) => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
    }
  };

  const approveBooking = async (bookingId) => {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed' })
      });
      if (!response.ok) throw new Error('API error');
      const result = await response.json();
      if (result.success) {
        setBookings((prev) => prev.map((b) => b._id === bookingId ? result.booking : b));
      }
    } catch (error) {
      console.warn('Backend offline. Performing local fallback for approveBooking.');
      setBookings((prev) => prev.map((b) => b._id === bookingId ? { ...b, status: 'confirmed' } : b));
    }
  };

  const rejectBooking = async (bookingId) => {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });
      if (!response.ok) throw new Error('API error');
      const result = await response.json();
      if (result.success) {
        setBookings((prev) => prev.map((b) => b._id === bookingId ? result.booking : b));
      }
    } catch (error) {
      console.warn('Backend offline. Performing local fallback for rejectBooking.');
      setBookings((prev) => prev.map((b) => b._id === bookingId ? { ...b, status: 'rejected' } : b));
    }
  };

  const toggleUserRole = () => {
    setCurrentRole((prev) => (prev === 'owner' ? 'customer' : 'owner'));
  };

  const loginUser = async (email, password, role = 'customer') => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setUser(result.user);
        setCurrentRole(result.user.role);
        return { success: true };
      } else {
        return { success: false, message: result.message || 'Login failed' };
      }
    } catch (error) {
      console.warn('Backend offline. Performing local fallback login.');
      const foundUser = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!foundUser) {
        return { success: false, message: 'User not found' };
      }
      if (foundUser.password !== password) {
        return { success: false, message: 'Incorrect password' };
      }
      if (foundUser.role !== role) {
        return { success: false, message: `This account is registered as a ${foundUser.role}, not a ${role}.` };
      }
      setUser(foundUser);
      setCurrentRole(foundUser.role);
      return { success: true };
    }
  };

  const registerUser = async (name, email, password, role, extraData = {}) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, extraData })
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setUsersList(prev => [...prev, result.user]);
        setUser(result.user);
        setCurrentRole(role);
        return { success: true };
      } else {
        return { success: false, message: result.message || 'Registration failed' };
      }
    } catch (error) {
      console.warn('Backend offline. Performing local fallback registration.');
      const emailExists = usersList.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        return { success: false, message: 'Email address already registered' };
      }

      const newUser = {
        _id: 'user_' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        password,
        role,
        image: dummyUserData.image,
        ...extraData
      };

      setUsersList(prev => [...prev, newUser]);
      setUser(newUser);
      setCurrentRole(role);
      return { success: true };
    }
  };

  const logoutUser = () => {
    setUser(null);
    setCurrentRole('customer');
  };

  return (
    <AppContext.Provider value={{
      cars,
      setCars,
      bookings,
      setBookings,
      user,
      setUser,
      currentRole,
      setCurrentRole,
      searchParams,
      setSearchParams,
      addCar,
      deleteCar,
      toggleCarAvailability,
      createBooking,
      cancelBooking,
      approveBooking,
      rejectBooking,
      toggleUserRole,
      usersList,
      loginUser,
      registerUser,
      logoutUser
    }}>
      {children}
    </AppContext.Provider>
  );
};
