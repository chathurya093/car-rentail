import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data', 'db.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Support base64 image uploads

// Helper to read DB
const readDB = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      // Create empty DB if not exists
      const initialData = { usersList: [], cars: [], bookings: [] };
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading database:', error);
    return { usersList: [], cars: [], bookings: [] };
  }
};

// Helper to write DB
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
};

// GET all data
app.get('/api/data', (req, res) => {
  const db = readDB();
  res.json({
    success: true,
    cars: db.cars || [],
    bookings: db.bookings || [],
    usersList: db.usersList || []
  });
});

// POST register user
app.post('/api/register', (req, res) => {
  const { name, email, password, role, extraData } = req.body;
  const db = readDB();
  
  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Missing required registration fields' });
  }

  const emailExists = db.usersList.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (emailExists) {
    return res.status(400).json({ success: false, message: 'Email address already registered' });
  }

  const newUser = {
    _id: 'user_' + Math.random().toString(36).substr(2, 9),
    name,
    email,
    password,
    role,
    image: '/src/assets/user_profile.png',
    ...extraData
  };

  db.usersList.push(newUser);
  writeDB(db);

  res.status(201).json({ success: true, user: newUser });
});

// POST login user
app.post('/api/login', (req, res) => {
  const { email, password, role } = req.body;
  const db = readDB();

  if (!email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Missing login credentials' });
  }

  const foundUser = db.usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!foundUser) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (foundUser.password !== password) {
    return res.status(401).json({ success: false, message: 'Incorrect password' });
  }

  if (foundUser.role !== role) {
    return res.status(403).json({ success: false, message: `This account is registered as a ${foundUser.role}, not a ${role}.` });
  }

  res.json({ success: true, user: foundUser });
});

// POST add car
app.post('/api/cars', (req, res) => {
  const newCar = req.body;
  const db = readDB();

  const formattedCar = {
    ...newCar,
    _id: 'car_' + Math.random().toString(36).substr(2, 9),
    isAvaliable: true,
    createdAt: new Date().toISOString()
  };

  db.cars.unshift(formattedCar);
  writeDB(db);

  res.status(201).json({ success: true, car: formattedCar });
});

// DELETE car
app.delete('/api/cars/:id', (req, res) => {
  const carId = req.params.id;
  const db = readDB();

  db.cars = db.cars.filter(c => c._id !== carId);
  // Set associated bookings to cancelled
  db.bookings = db.bookings.map(b => b.car?._id === carId ? { ...b, status: 'cancelled' } : b);
  
  writeDB(db);
  res.json({ success: true });
});

// PATCH toggle car availability
app.patch('/api/cars/:id/availability', (req, res) => {
  const carId = req.params.id;
  const db = readDB();

  let updatedCar = null;
  db.cars = db.cars.map(c => {
    if (c._id === carId) {
      updatedCar = { ...c, isAvaliable: !c.isAvaliable };
      return updatedCar;
    }
    return c;
  });

  if (!updatedCar) {
    return res.status(404).json({ success: false, message: 'Car not found' });
  }

  writeDB(db);
  res.json({ success: true, car: updatedCar });
});

// POST create booking
app.post('/api/bookings', (req, res) => {
  const booking = req.body;
  const db = readDB();

  const newBooking = {
    ...booking,
    _id: 'booking_' + Math.random().toString(36).substr(2, 9),
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  db.bookings.unshift(newBooking);
  writeDB(db);

  res.status(201).json({ success: true, booking: newBooking });
});

// PATCH update booking status
app.patch('/api/bookings/:id/status', (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body;
  const db = readDB();

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required' });
  }

  let updatedBooking = null;
  db.bookings = db.bookings.map(b => {
    if (b._id === bookingId) {
      updatedBooking = { ...b, status };
      return updatedBooking;
    }
    return b;
  });

  if (!updatedBooking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  writeDB(db);
  res.json({ success: true, booking: updatedBooking });
});

app.listen(PORT, () => {
  console.log(`Car Rental backend server is running on http://localhost:${PORT}`);
});
