const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Staff = require('./models/Staff');
const Service = require('./models/Service');
const Booking = require('./models/Booking');
const Availability = require('./models/Availability');

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  await User.deleteMany();
  await Staff.deleteMany();
  await Service.deleteMany();
  await Booking.deleteMany();
  await Availability.deleteMany();
  console.log('Cleared existing data');

  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await User.insertMany([
    { name: 'Admin User', email: 'admin@salon.com', password: hashedPassword, role: 'admin' },
    { name: 'Jane Smith', email: 'jane@salon.com', password: hashedPassword, role: 'customer' },
    { name: 'Carlos Reyes', email: 'carlos@salon.com', password: hashedPassword, role: 'customer' },
  ]);
  console.log('Users seeded');

  const staff = await Staff.insertMany([
    {
      name: 'Maria Lopez',
      email: 'maria@salon.com',
      photo: '',
      specialties: ['Haircut', 'Coloring'],
      workingHours: [
        { day: 'Mon', start: '09:00', end: '17:00' },
        { day: 'Tue', start: '09:00', end: '17:00' },
        { day: 'Wed', start: '09:00', end: '17:00' },
        { day: 'Thu', start: '09:00', end: '17:00' },
        { day: 'Fri', start: '09:00', end: '17:00' },
      ],
      daysOff: ['Sat', 'Sun'],
    },
    {
      name: 'James Carter',
      email: 'james@salon.com',
      photo: '',
      specialties: ['Beard Trim', 'Haircut'],
      workingHours: [
        { day: 'Tue', start: '10:00', end: '18:00' },
        { day: 'Wed', start: '10:00', end: '18:00' },
        { day: 'Thu', start: '10:00', end: '18:00' },
        { day: 'Fri', start: '10:00', end: '18:00' },
        { day: 'Sat', start: '10:00', end: '16:00' },
      ],
      daysOff: ['Sun', 'Mon'],
    },
  ]);
  console.log('Staff seeded');

  const services = await Service.insertMany([
    { name: 'Haircut', description: 'Classic cut and style', price: 30, duration: 30, category: 'Hair' },
    { name: 'Beard Trim', description: 'Shape and trim beard', price: 20, duration: 20, category: 'Beard' },
    { name: 'Hair Coloring', description: 'Full color treatment', price: 80, duration: 90, category: 'Hair' },
    { name: 'Shampoo & Blow Dry', description: 'Wash and blow dry', price: 25, duration: 30, category: 'Hair' },
    { name: 'Hot Towel Shave', description: 'Traditional straight razor shave', price: 35, duration: 40, category: 'Beard' },
  ]);
  console.log('Services seeded');

  await Booking.insertMany([
    {
      customer: users[1]._id,
      staff: staff[0]._id,
      service: services[0]._id,
      date: '2024-12-20',
      timeSlot: '10:00',
      status: 'confirmed',
      notes: 'First time customer',
    },
    {
      customer: users[2]._id,
      staff: staff[1]._id,
      service: services[1]._id,
      date: '2024-12-20',
      timeSlot: '11:00',
      status: 'pending',
      notes: '',
    },
  ]);
  console.log('Bookings seeded');

  await Availability.insertMany([
    {
      staff: staff[0]._id,
      date: '2024-12-20',
      slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00'],
      bookedSlots: ['10:00'],
    },
    {
      staff: staff[1]._id,
      date: '2024-12-20',
      slots: ['10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30'],
      bookedSlots: ['11:00'],
    },
  ]);
  console.log('Availability seeded');

  console.log('Seed complete');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});