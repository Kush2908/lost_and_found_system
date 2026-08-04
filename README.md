# Project Overview

The Online Lost and Found System is a comprehensive web application designed to help communities (universities, offices, neighborhoods) track, report, and claim lost and found items securely and efficiently.

## Core Features
- **User Authentication**: Secure JWT-based login and registration.
- **Reporting System**: Users can report lost or found items with details, categories, locations, and images.
- **Search & Filter**: Advanced filtering by item type, category, date, and keyword.
- **Claiming System**: Users can submit proof to claim found items.
- **Admin Dashboard**: Admins can review claims, manage categories, and oversee the entire system.
- **Image Uploads**: Secure image hosting using Cloudinary.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Axios, React Router.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB, Mongoose.
- **Authentication**: JSON Web Tokens (JWT), bcrypt.js.
- **File Storage**: Cloudinary, Multer.

## Folder Structure
```
online-lost-and-found-system/
├── client/                 # React frontend
│   ├── public/             # Static assets
│   ├── src/                # React source code
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API integration
│   │   ├── context/        # Global state management
│   │   └── App.jsx         # Main application component
│   └── package.json        
└── server/                 # Node.js backend
    ├── controllers/        # Request handlers
    ├── models/             # Mongoose schemas
    ├── routes/             # API routes
    ├── middleware/         # Auth & upload middleware
    ├── config/             # DB & Env configuration
    ├── server.js           # Entry point
    └── package.json
```

## Quick Start

### Backend
1. `cd server`
2. `npm install`
3. Create a `.env` file with MongoDB URI, JWT Secret, and Cloudinary keys.
4. `npm run dev`

### Frontend
1. `cd client`
2. `npm install`
3. Create a `.env` file with `VITE_API_BASE_URL=http://localhost:5000/api/v1`
4. `npm run dev`
