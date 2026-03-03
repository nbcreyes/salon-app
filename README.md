# Luxe Salon — Full Stack Booking App

A full stack salon booking application built with Node.js, React, and React Native. Customers can browse services, view staff, and book appointments. Admins can manage bookings, services, and staff availability.

**Live Demo:** https://salon-app-mu.vercel.app
**Backend API:** https://salon-app-production-f532.up.railway.app/api

---

## Tech Stack

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

**Frontend**
- React + Vite
- Tailwind CSS
- React Router
- Lucide React icons

**Mobile**
- React Native + Expo
- Expo Router + React Navigation
- AsyncStorage for session persistence
- Expo Notifications
- Ionicons

---

## Features

**Customer**
- Browse services and staff
- Book appointments with real-time availability
- View and cancel bookings
- Push notification reminders (mobile)

**Admin**
- Dashboard with booking stats and revenue
- Confirm, cancel, and complete bookings
- Manage services (add, edit, delete)
- Manage staff profiles and availability
- Search and filter bookings

---

## Project Structure
```
salon-app/
├── backend/         # Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   └── server.js
├── frontend/        # React web app
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
└── mobile/          # React Native app
    ├── screens/
    ├── services/
    ├── context/
    └── theme.js
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```
VITE_API_URL=http://localhost:5000/api
```
```bash
npm run dev
```

### Mobile
```bash
cd mobile
npm install
npx expo start
```

### Seed the database
```bash
cd backend
node src/seed.js
```

Default accounts after seeding:
- Admin: `admin@salon.com` / `password123`
- Customer: `jane@salon.com` / `password123`

---

## Deployment

**Backend** — Railway
- Root directory: `backend`
- Environment variables: `PORT`, `MONGO_URI`, `JWT_SECRET`

**Frontend** — Vercel
- Root directory: `frontend`
- Environment variables: `VITE_API_URL`

---

## Screenshots

## Author

Built by Neil Benedict Reyes as a portfolio project.